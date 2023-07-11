<script lang="ts">
    import { auth } from "$lib/firebase";
    import {programmeStore} from '$lib/prog/store';
    import { userStore } from 'sveltefire';
    import type { Programme } from '$lib/domains';
    import { browser } from "$app/environment";
    import QRCode from 'qrcode';
    import { page } from "$app/stores";

    const user = userStore(auth);

    let programme: Programme|null;
    let canvas: any;
    const programmeId = $page.params.progId;

    // subscribe to the store to get the current programme according to the url
    programmeStore.subscribe(value => {
        programme = value;
    });

    async function copyUrl() {
    if (browser) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('URL copied to clipboard!');
      } catch (err: any) {
        alert('Failed to copy URL: ' + err.message);
      }
    }
    }

    async function generateQRCode() {
    if (browser) {
      try {
        await QRCode.toCanvas(canvas, window.location.href);
        const dataUrl = canvas.toDataURL();
        window.open(dataUrl, '_blank');
      } catch (err) {
        console.error(err);
      }
    }
    }

</script>

{#if $user}
{#if $user.uid == programme?.owner_uid}
<div class=" flex justify-between p-7 bg-indigo-700 items-center">
    <a class=" text-stone-200 btn btn-ghost normal-case text-xl" href="/">Sacrament Planner</a>
    <a class=" btn text-indigo-800" href="/account">View Account</a>
</div>
<div class="bg-gray-200 w-full p-4">
    <div class=" flex justify-between">
        <div>
        <button class="btn bg-blue-600 text-white hover:bg-blue-800" on:click={copyUrl}>Copy URL</button>
        <button class="btn bg-blue-600 text-white hover:bg-blue-800" on:click={generateQRCode}>Generate QR Code</button>
        </div>
        <div>
        <a class="btn bg-blue-600 text-white hover:bg-blue-800" href="/{programmeId}/edit">Edit Content</a>
        </div>
    </div>
    <canvas bind:this={canvas} style="display:none;"></canvas>
</div>
{/if}
{/if}

<div class="text-center p-10 bg-white shadow-lg rounded-lg">
    {#if programme}
    <h1 class="text-3xl font-bold mb-4">{programme.wardName}</h1>
    <p class="text-xl mb-6">Sacrament Meeting {programme.date || ""}</p>
    <div class="flex flex-col space-y-2 mb-6 max-w-lg mx-auto">
        <div class="flex justify-between"><span>Conducting</span><span>{programme.conducting}</span></div>
        <div class="flex justify-between"><span>Presiding</span><span>{programme.presiding}</span></div>
        <div class="flex justify-between"><span>Chorister</span><span>{programme.chorister}</span></div>
        <div class="flex justify-between"><span>Pianist</span><span>{programme.pianist}</span></div>
    </div>
    <hr class="mb-6 max-w-lg mx-auto">
    <div class="max-w-lg mx-auto">
    <div class="mb-6">
        <span>Announcments</span>
    </div>
    <div class="flex justify-between mb-6">
        <span>Opening Hymn</span>
        {programme.musicalNumber1 || "TBD"}
    </div>
    <div class="flex justify-between mb-6">
        <span>Invocation</span>
        <span>{programme.invocation || "By Invitation"}</span>
    </div>
    <div class="mb-6">
        <span>Ward / Stake Business</span>
    </div>
    <div class="flex justify-between mb-6">
        <span>Sacrament Hymn</span>
        {programme.musicalNumber2 || "TBD"}
    </div>
    <div class="mb-6">Administration of the Sacrament</div>
    <div class="flex justify-between mb-6">
        <span>Speaker</span>
        <span>{programme.speaker1 || "TBD"}</span>
    </div>
    {#if programme.musicalNumber3}
        <div class="flex justify-between mb-6">
            <span>Intermediate Hymn</span>
            <span>{programme.musicalNumber3}</span>
        </div>
    {/if}
    <div class="flex justify-between mb-6">
        <span>Speaker</span>
        <span>{programme.speaker2 || "TBD"}</span>
    </div>
    {#if programme.speaker3}
    <div class="flex justify-between mb-6">
        <span>Speaker</span>
        <span>{programme.speaker3}</span>
    </div>
    {/if}
    {#if programme.musicalNumber4}
        <div class="flex justify-between mb-6">
            <span>Closing Hymn</span>
            {programme.musicalNumber4}
        </div>
    {/if}
    </div>
    <div class="flex justify-between mb-6 max-w-lg mx-auto">
        <span>Benediction</span>
        <span>{programme.benediction || "By Invitation"}</span>
    </div>
    {/if}
</div>