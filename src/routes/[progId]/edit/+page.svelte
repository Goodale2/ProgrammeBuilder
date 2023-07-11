<script lang="ts">
    import { auth } from "$lib/firebase";
    import { userStore } from 'sveltefire';
    import type { Programme } from '$lib/domains';
    import { goto } from "$app/navigation";
    import { onMount } from 'svelte';
    import { database } from "$lib/firebase";
    import { doc, updateDoc } from "firebase/firestore";
    import { page } from "$app/stores";
    import { programmeStore } from "$lib/prog/store";

    const user = userStore(auth);

    let programme: Programme;
    let initialProgramme: Programme;
    const progId = $page.params.progId;
    const nextSunday: string = findNextSunday();

    // Set variables for all required form fields
    let chorister: HTMLInputElement, conducting: HTMLInputElement, pianist: HTMLInputElement, presiding: HTMLInputElement, wardName: HTMLInputElement;

    // subscribe to the store to get the current programme according to the url
    programmeStore.subscribe(value => {
        const convValue: unknown = value as unknown;
        programme = convValue as Programme;
        initialProgramme = {...programme};
        if (programme.owner_uid !== $user?.uid) {
            goto("/");
        }
    });

    function findNextSunday() {
        const today = new Date();
        const daysUntilNextSunday = 6 - today.getDay();
        const nextSunday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysUntilNextSunday);
        
        // Format the date as string
        const day = nextSunday.getDate();
        const month = nextSunday.toLocaleString('default', { month: 'long' });
        const year = nextSunday.getFullYear();
        const suffix = [1, 21, 31].includes(day % 100) ? 'st' : [2, 22].includes(day % 100) ? 'nd' : [3, 23].includes(day % 100) ? 'rd' : 'th';
        
        return `${month} ${day}${suffix}, ${year}`;
    }

    async function handleSubmit() {
        // Disable the save button unless a field has beenn changed.
        const docRef = doc(database, "programmes", progId);
        if(!requiredFieldsAreValid()) return;
        sanitizeProgrammeDataForSubmit(programme);

        await updateDoc(docRef, {...programme});
        programmeStore.set(programme);
        // Pop toast saying changes saved!
        goto(`/${progId}`)
    }

    function requiredFieldsAreValid(): boolean {
        if (!wardName.validity.valid) {
            wardName.focus();
            wardName.classList.add("border-red-500");
            return false;
        }
        wardName.classList.remove("border-red-500");

        if (!conducting.validity.valid) {
            conducting.focus();
            conducting.classList.add("border-red-500");
            return false;
        }
        conducting.classList.remove("border-red-500");

        if (!presiding.validity.valid) {
            presiding.focus();
            presiding.classList.add("border-red-500");
            return false;
        }
        presiding.classList.remove("border-red-500");

        if (!presiding.validity.valid) {
            chorister.focus();
            chorister.classList.add("border-red-500");
            return false;
        }
        chorister.classList.remove("border-red-500");

        if (!presiding.validity.valid) {
            pianist.focus();
            pianist.classList.add("border-red-500");
            return false;
        }
        pianist.classList.remove("border-red-500");

        return true;
    }

    function sanitizeProgrammeDataForSubmit(programme: Programme) {
        if (programme.benediction == '' || programme.benediction == undefined) programme.benediction = null;
        if (programme.date == '' || programme.date == undefined) programme.date = nextSunday;
        if (programme.invocation == '' || programme.invocation == undefined) programme.invocation = null;
        if (programme.musicalNumber1 == '' || programme.musicalNumber1 == undefined) programme.musicalNumber1 = null;
        if (programme.musicalNumber2 == '' || programme.musicalNumber2 == undefined) programme.musicalNumber2 = null;
        if (programme.musicalNumber3 == '' || programme.musicalNumber3 == undefined) programme.musicalNumber3 = null;
        if (programme.musicalNumber4 == '' || programme.musicalNumber4 == undefined) programme.musicalNumber4 = null;
        if (programme.speaker1 == '' || programme.speaker1 == undefined) programme.speaker1 = null;
        if (programme.speaker2 == '' || programme.speaker2 == undefined) programme.speaker2 = null;
        if (programme.speaker3 == '' || programme.speaker3 == undefined) programme.speaker3 = null;
    }

    onMount(() => {
    // Fetch the existing data from an API or set default values
    programme = {
      benediction: programme.benediction,
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
    <a class=" btn text-indigo-800" href="/account">View Account</a>
    </div>
</div>
<div class="bg-gray-200 w-full p-4">
    <div class=" flex justify-end">
        <div>
        <button class="btn bg-blue-600 text-white hover:bg-blue-800" on:click={handleSubmit}>Save</button>
        </div>
    </div>
</div>

<main>
    <form on:submit|preventDefault={handleSubmit} class="">
    <div class="text-center p-10 bg-white shadow-lg rounded-lg">
        <h1 class="text-3xl font-bold mb-4"><input required name="wardName" type="text" bind:value={programme.wardName} bind:this={wardName} class="border rounded p-2 text-center"/></h1>
        <p class="text-xl mb-6 text-center">Sacrament Meeting <input name="date" type="text" placeholder="{nextSunday}" bind:value={programme.date} class="border rounded p-2 text-right"/></p>
        <div class="flex flex-col space-y-2 mb-6 max-w-lg mx-auto">
            <div class="flex justify-between"><span>Conducting*</span><span><input required name="conducting" type="text" bind:value={programme.conducting} bind:this={conducting} class="border rounded text-right"/></span></div>
            <div class="flex justify-between"><span>Presiding*</span><span><input required name="presiding" type="text" bind:value={programme.presiding} bind:this={presiding} class="border rounded text-right"/></span></div>
            <div class="flex justify-between"><span>Chorister*</span><span><input required name="chorister" type="text" bind:value={programme.chorister} bind:this={chorister} class="border rounded text-right"/></span></div>
            <div class="flex justify-between"><span>Pianist*</span><span><input required name="pianist" type="text" bind:value={programme.pianist} bind:this={pianist} class="border rounded text-right"/></span></div>
        </div>
        <hr class="mb-6 max-w-lg mx-auto">
        <div class="max-w-lg mx-auto">
        <div class="mb-6">
            <span>Announcments</span>
        </div>
        <div class="flex justify-between items-center mb-6">
            <span>Opening Hymn</span>
            <input name="musicalNumber1" type="text" bind:value={programme.musicalNumber1} class="border rounded text-right p-2"/>
        </div>
        <div class="flex justify-between items-center mb-6">
            <span>Invocation</span>
            <input name="invocation" placeholder="By Invetation" type="text" bind:value={programme.invocation} class="border rounded text-right p-2"/>
        </div>
        <div class="mb-6">
            <span>Ward / Stake Business</span>
        </div>
        <div class="flex justify-between items-center mb-6">
            <span>Sacrament Hymn</span>
            <input name="musicalNumber2" type="text" bind:value={programme.musicalNumber2} class="border rounded text-right p-2"/>
        </div>
        <div class="mb-6">Administration of the Sacrament</div>
        <div class="flex justify-between items-center mb-6">
            <span>Speaker</span>
            <input name="speaker1" type="text" bind:value={programme.speaker1} class="border rounded p-2 text-right"/>
        </div>
            <div class="flex justify-between items-center mb-6">
                <span>Intermediate Hymn</span>
                <input name="musicalNumber3" type="text" bind:value={programme.musicalNumber3} class="border rounded p-2 text-right"/>
            </div>
        <div class="flex justify-between items-center mb-6">
            <span>Speaker</span>
            <input name="speaker2" type="text" bind:value={programme.speaker2} class="border rounded p-2 text-right"/>
        </div>
        <div class="flex justify-between items-center mb-6">
            <span>Speaker</span>
            <input name="speaker3" type="text" bind:value={programme.speaker3} class="border rounded p-2 text-right"/>
        </div>
            <div class="flex justify-between items-center mb-6">
                <span>Closing Hymn</span>
                <input name="musicalNumber4" type="text" bind:value={programme.musicalNumber4} class="border rounded p-2 text-right"/>
            </div>
        </div>
        <div class="flex justify-between mb-6 max-w-lg items-center mx-auto">
            <span>Benediction</span>
            <span><input name="benediction" placeholder="By Invetation" type="text" bind:value={programme.benediction} class="border rounded p-2 text-right"/></span>
        </div>
    </form>

  </main>