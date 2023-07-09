<script lang="ts">
    import { database } from "$lib/firebase";
    import { doc, getDoc } from "firebase/firestore";
    import { page } from '$app/stores';
    import { onMount } from "svelte";
    import {programmeStore} from '$lib/prog/store';
    import type { Programme } from "$lib/domains";

    let loading: boolean = true;
    let programme: Programme|undefined = undefined;

    async function loadProgrammeById() {
        const docRef = doc(database, "programmes", $page.params.progId); // replace with your collection name and document id
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            programme = docSnap.data() as Programme;
            programmeStore.set(programme); // update the store with the fetched data
            console.log("Programme data: " + JSON.stringify(programme));
            loading = false;
        } else {
            loading = false;
        }
    }

    onMount(async () => await loadProgrammeById());

</script>

{#if loading}
<div class=" bg-slate-200 p-20 rounded-xl flex flex-col mx-auto items-center text-center my-auto border-2 border-dance">
<p class=" text-primary text-xl font-bold">Getting Things Ready</p>
<span class="loading loading-infinity loading-lg text-primary"></span>
</div>
{:else}
    {#if programme}
        <slot></slot>
    {:else}
        <h2>We couldn't find your programme!</h2>
        <!-- TODO: Handle this -->
    {/if}
{/if}