<script lang="ts">
    import { auth } from "$lib/firebase";
    import {programmeStore} from '$lib/prog/store';
    import { userStore } from 'sveltefire';
    import type { Programme } from '$lib/domains';
    import { goto } from "$app/navigation";
    import { onMount } from 'svelte';
    import { database } from "$lib/firebase";
    import { doc, updateDoc } from "firebase/firestore";
    import { page } from "$app/stores";

    const user = userStore(auth);

    let programme: Programme;
    let initialProgramme: Programme;
    let isFormChanged = false;

    // subscribe to the store to get the current programme according to the url
    programmeStore.subscribe(value => {
        const convValue: unknown = value as unknown;
        programme = convValue as Programme;
        initialProgramme = {...programme};
        if (programme.owner_uid !== $user?.uid) {
            goto("/");
        }
    });

    // reactive statement to check if form has changed
    $: isFormChanged = programme && initialProgramme && JSON.stringify(programme) !== JSON.stringify(initialProgramme);

    async function handleSubmit() {
        // Disable the save button unless a field has beenn changed.
        const docRef = doc(database, "programmes", $page.params.progId); // replace with your collection name and document id
        await updateDoc(docRef, {...programme});
        programmeStore.set(programme);
        // Pop toast saying changes saved!
    }

    onMount(() => {
    // Fetch the existing data from an API or set default values
    programme = {
      announcements: programme.announcements,
      chorister: programme.chorister,
      conducting: programme.conducting,
      date: programme.date,
      invocation: programme.invocation,
      musicalNumber1: programme.musicalNumber1,
      musicalNumber2: programme.musicalNumber2,
      musicalNumber3: programme.musicalNumber3,
      musicalNumber4: programme.musicalNumber4,
      owner_uid: programme.owner_uid,
      pianist: programme.pianist,
      presiding: programme.presiding,
      speaker1: programme.speaker1,
      speaker2: programme.speaker2,
      speaker3: programme.speaker3,
      wardName: programme.wardName
    };
  });

</script>

<div class=" flex justify-between p-7 bg-indigo-700 items-center">
    <a class=" text-stone-200 btn btn-ghost normal-case text-xl" href="/">Sacrament Planner</a>
    <div>
    <a class="btn text-indigo-800 mr-3" href="/{$page.params.progId}">View Programme</a>
    <a class=" btn text-indigo-800" href="/account">View Account</a>
    </div>
</div>

<main>
    
    <form on:submit|preventDefault={handleSubmit} class="flex flex-col space-y-4 p-10 bg-white shadow-lg rounded-lg max-w-screen-sm mx-auto my-5">
        <div class="flex flex-col">
          <label class="label" for="wardName">
            <span class="label-text">Ward Name:</span>
          </label>
          <input required name="wardName" type="text" bind:value={programme.wardName} class="border rounded p-2 w-full"/>
        </div>
  
        <div class="flex flex-col">
          <label class="label" for="date">
            <span class="label-text">Date:</span>
          </label>
          <input name="date" type="text" bind:value={programme.date} class="border rounded p-2 w-full"/>
        </div>
  
        <div class="flex flex-col">
          <label class="label" for="conducting">
            <span class="label-text">Conducting:</span>
          </label>
          <input required name="conducting" type="text" bind:value={programme.conducting} class="border rounded p-2 w-full"/>
        </div>
  
        <div class="flex flex-col">
          <label class="label" for="presiding">
            <span class="label-text">Presiding:</span>
          </label>
          <input required name="presiding" type="text" bind:value={programme.presiding} class="border rounded p-2 w-full"/>
        </div>
  
        <div class="flex flex-col">
          <label class="label" for="chorister">
            <span class="label-text">Chorister:</span>
          </label>
          <input name="chorister" type="text" bind:value={programme.chorister} class="border rounded p-2 w-full"/>
        </div>
  
        <div class="flex flex-col">
          <label class="label" for="pianist">
            <span class="label-text">Pianist:</span>
          </label>
          <input name="pianist" type="text" bind:value={programme.pianist} class="border rounded p-2 w-full"/>
        </div>
  
        <div class="flex flex-col">
          <label class="label" for="announcements">
            <span class="label-text">Announcements:</span>
          </label>
          <input name="announcements" type="text" bind:value={programme.announcements} class="border rounded p-2 w-full"/>
        </div>
  
        <div class="flex flex-col">
          <label class="label" for="musicalNumber1">
            <span class="label-text">Musical Number 1:</span>
          </label>
          <input name="musicalNumber1" type="text" bind:value={programme.musicalNumber1} class="border rounded p-2 w-full"/>
        </div>
  
        <div class="flex flex-col">
          <label class="label" for="invocation">
            <span class="label-text">Invocation:</span>
          </label>
          <input name="invocation" type="text" bind:value={programme.invocation} class="border rounded p-2 w-full"/>
        </div>
  
        <div class="flex flex-col">
          <label class="label" for="musicalNumber2">
            <span class="label-text">Musical Number 2:</span>
          </label>
          <input name="musicalNumber2" type="text" bind:value={programme.musicalNumber2} class="border rounded p-2 w-full"/>
        </div>
  
        <div class="flex flex-col">
          <label class="label" for="speaker1">
            <span class="label-text">Speaker 1:</span>
          </label>
          <input name="speaker1" type="text" bind:value={programme.speaker1} class="border rounded p-2 w-full"/>
        </div>
  
        <div class="flex flex-col">
          <label class="label" for="musicalNumber3">
            <span class="label-text">Musical Number 3:</span>
          </label>
          <input name="musicalNumber3" type="text" bind:value={programme.musicalNumber3} class="border rounded p-2 w-full"/>
        </div>
  
        <div class="flex flex-col">
          <label class="label" for="speaker2">
            <span class="label-text">Speaker 2:</span>
          </label>
          <input name="speaker2" type="text" bind:value={programme.speaker2} class="border rounded p-2 w-full"/>
        </div>
  
        <div class="flex flex-col">
          <label class="label" for="speaker3">
            <span class="label-text">Speaker 3:</span>
          </label>
          <input name="speaker3" type="text" bind:value={programme.speaker3} class="border rounded p-2 w-full"/>
        </div>
  
        <div class="flex flex-col">
          <label class="label" for="musicalNumber4">
            <span class="label-text">Musical Number 4:</span>
          </label>
          <input name="musicalNumber4" type="text" bind:value={programme.musicalNumber4} class="border rounded p-2 w-full"/>
        </div>
  
        <button type="submit" class="bg-blue-500 text-white rounded p-2 mt-4 self-end {isFormChanged ? '' : 'opacity-50'}" disabled={!isFormChanged}>Save</button>
  </form>
  
  </main>