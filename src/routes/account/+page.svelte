<script lang="ts">
    import { auth } from "$lib/firebase";
    import { database } from "$lib/firebase";
    import { addDoc, collection, getDocs, query, where} from "firebase/firestore";
    import { userStore } from 'sveltefire';
    import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
    import type { nullable, Programme } from "$lib/domains";
    import { goto } from "$app/navigation";

    let userHasDocument: boolean = false;
    let programmeId: string|undefined;
    let programme: Programme|Partial<Programme>|nullable = null;
    let loading: boolean = true;
    let onboarding: boolean = false;

    async function signInWithGoogle() {
        loading = true;
        try {
            const provider = new GoogleAuthProvider();
            const user = await signInWithPopup(auth, provider);
            await checkUserHasDocument(user.user.uid);
        } catch (e: any) {
            loading = false;
        }
    }

    async function checkUserHasDocument(uid: string) {
        const queryDoc = query(collection(database, "programmes"), where("owner_uid", "==", uid));
        const querySnapshot = await getDocs(queryDoc);
        if (!querySnapshot.empty) {
            userHasDocument = true;
            programmeId = querySnapshot.docs[0].id; // There should always only be one.
            programme = querySnapshot.docs[0].data as unknown as Programme;
        }
        loading = false;
    }

    const user = userStore(auth);

    async function handleSignOut() {
        signOut(auth);
        location.reload();
    }

    // reactive statement to check if a user is logged in when the page loads
    $: {
        if ($user) {
            checkUserHasDocument($user.uid);
        } else {
            userHasDocument = false;
            programmeId = undefined;
            loading = false;
        }
    }

    async function handleSubmit() {
        // Validate the form fields and set the other values to null
        const docRef = await addDoc(collection(database, "programmes"), programme);
        console.log("Document written with ID: ", docRef.id);
        goto(`/${docRef.id}/edit`);
    }

    function activateOnboarding() {
        let newProgramme: Partial<Programme> = {};
        programme = newProgramme;
        programme.owner_uid = $user!.uid;
        document.getElementById("onboarding-btn")?.remove();
        onboarding = true;
    }

</script>

{#if loading}
<p class=" text-primary text-xl font-bold">Getting Things Ready</p>
<span class="loading loading-infinity loading-lg text-primary"></span>
{:else}
{#if $user}
<h2 class=" text-xl">Hello, {$user.displayName}!</h2>
<button class="btn btn-danger" style="position: absolute; top: 27px; right: 35px;" on:click={() => handleSignOut()}>Sign Out</button>
{#if userHasDocument && programmeId}
<div class="flex mt-5">
    <div class="grid h-20 flex-grow card bg-base-300 rounded-box place-items-center p-5">
        <a class=" btn btn-ghost hover:bg-transparent" href="/{programmeId}">View Your Programme</a>
    </div>
    <div class="divider divider-horizontal">OR</div>
    <div class="grid h-20 flex-grow card bg-base-300 rounded-box place-items-center p-5">
        <a class=" btn btn-ghost hover:bg-transparent" href="/{programmeId}/edit">Edit Your Programme</a>
    </div>
</div>
{:else}
<div id="onboarding-btn" class="grid flex-grow card bg-base-300 rounded-box place-items-center mt-5">
    <button class="btn btn-ghost hover:bg-transparent" on:click={() => activateOnboarding()}>Get Started</button>
</div>
{/if}
{:else}
<h2>Login to get started!</h2>
<button class="btn btn-primary" on:click={signInWithGoogle}>Sign in with Google</button>
{/if}
{/if}

{#if onboarding && (programme != null && programme != undefined)}
<div>
    <form class=" flex flex-col gap-4" on:submit|preventDefault={handleSubmit}>
        <div class="form-control w-full max-w-xs">
            <label class="label" for="ward">
                <span class="label-text">Ward or Branch Name</span>
            </label>
            <input required name="ward" type="text" class="input input-bordered w-full max-w-xs" bind:value={programme.wardName}>
        </div>
        <div class="form-control w-full max-w-xs">
            <label class="label" for="bishop">
                <span class="label-text" title="Usually Bishop or Branch President">Presiding Leader</span>
            </label>
            <input required name="bishop" type="text" class="input input-bordered w-full max-w-xs" bind:value={programme.presiding}>
        </div>
        <div class="form-control w-full max-w-xs">
            <label class="label" for="conducting">
                <span class="label-text">First Counsoler</span>
            </label>
            <input required name="conducting" type="text" class="input input-bordered w-full max-w-xs" bind:value={programme.conducting}>
        </div>
        <div class="form-control w-full max-w-xs">
            <label class="label" for="chorister">
                <span class="label-text">Chorister</span>
            </label>
            <input name="chorister" type="text" class="input input-bordered w-full max-w-xs" bind:value={programme.chorister}>
        </div>
        <div class="form-control w-full max-w-xs">
            <label class="label" for="pianist">
                <span class="label-text">Pianist</span>
            </label>
            <input name="pianist" type="text" class="input input-bordered w-full max-w-xs" bind:value={programme.pianist}>
        </div>
        <button class="btn mt-5" type="submit">Complete Setup</button>
    </form>
</div>
{/if}