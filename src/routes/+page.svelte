<script lang="ts">
    import { auth } from "$lib/firebase";
    import { userStore } from 'sveltefire';

    const user = userStore(auth);
    let linkText: string = "Sign In";

    if ($user) {
        linkText = "View Account";
    }
</script>

<div class=" flex justify-between p-7 bg-indigo-700 items-center">
    <h1 class=" text-stone-200 btn btn-ghost normal-case text-xl">Sacrament Planner</h1>
    <a class=" btn text-indigo-800" href="/account">{linkText}</a>
</div>

<main class=" p-11">
    <p>You can edit and share your sacrament programmes with this simple app.</p>
</main>



