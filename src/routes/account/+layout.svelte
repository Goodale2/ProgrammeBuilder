<script lang="ts">
    import { page } from "$app/stores";
    // TODO: Kill this and just make it a login page, once they login, find their porgramme.
    //  if no programme, send them to an onboarding page to fill out basic information and populate their programme.
    //  Once it's populated in the db, redirect them to their programme page and allow them to edit it.
    // They will see it in view mode and have buttons to edit and share it (via copying the link or making a QR code).
</script>

<div class=" flex justify-between p-7 bg-indigo-700 items-center">
    <a href="/" class=" text-stone-200 btn btn-ghost normal-case text-xl">Sacrament Planner</a>
</div>
<main class=" bg-slate-300 mx-auto w-full h-full">
    <div class="card-body items-center text-center">
        <slot></slot>
    </div>
</main>