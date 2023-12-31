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

    const user = userStore(auth);

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

    async function handleSignOut() {
        loading = true;
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
            setTimeout(() => loading = false, 1500); // This is a cheap hack to work around the async nature of loading state...
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
<div class=" bg-slate-200 p-20 rounded-xl flex flex-col mx-auto items-center text-center my-auto border-2 border-dance">
    <p class=" text-primary text-xl font-bold">Getting Things Ready</p>
    <span class="loading loading-infinity loading-lg text-primary"></span>
    </div>
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
<p>Thank you for choosing to try out ProgrammeBuilder!<br/> Get started by pressing the button bellow and entering some basic information.</p>
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
                <span class="label-text">Ward or Branch Name *</span>
            </label>
            <input required name="ward" type="text" class="input input-bordered w-full max-w-xs" bind:value={programme.wardName}>
        </div>
        <button class="btn mt-5" type="submit">Start Planning</button>
    </form>
</div>
{/if}