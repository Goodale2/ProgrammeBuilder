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
    <div class="container mx-auto px-4">
        <div class="text-center my-12">
            <h1 class="text-4xl font-bold">Welcome to ProgrammeBuilder!</h1>
            <p class="text-xl mt-4">ProgrammeBuilder is a cloud-based application designed to simplify the creation and sharing of Sacrament Meeting Programmes.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="card bordered bg-slate-200">
                <div class="card-body">
                    <h2 class="card-title">Create with Ease</h2> 
                    <p>Our application is built on the robust Svelte project, offering a seamless and user-friendly experience.</p>
                </div>
            </div>
            <div class="card bordered bg-slate-200">
                <div class="card-body">
                    <h2 class="card-title">Share Instantly</h2> 
                    <p>Once your programme is ready, share it with your attendees in a snap. You can distribute your programme via a direct link or through a QR code.</p>
                </div>
            </div>
            <div class="card bordered bg-slate-200">
                <div class="card-body">
                    <h2 class="card-title">Access Anywhere</h2> 
                    <p>Being a cloud-based application, ProgrammeBuilder allows you to create and manage your programmes from any device, anywhere.</p>
                </div>
            </div>
        </div>
        <div class="text-center my-12">
            <a class="btn btn-primary" href="/account">Get Started Today</a>
        </div>
    </div>
</main>



