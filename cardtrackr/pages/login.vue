<script setup>

    import logo from "@/assets/CardTrackr.svg"

    const client = useSupabaseClient();
    const user = useSupabaseUser();
    const email = ref("");
    const password = ref(null);
    const errorMsg = ref(null);
    const router = useRouter();

    const sign = ref("up")

    // Redirect to home if user is already logged in
    watchEffect(() => {
    if (user.value) {
        return navigateTo('/')
    }
    })
        
    const signIn = async () => {
        try {
            const {error} = await client.auth.signInWithPassword({
                email: email.value,
                password: password.value,
            });
            if (error) throw error;
            router.push("/browse");
        } catch (error) {
            errorMsg.value = error.message;
        }
    }

    const signUp = async () => {
        try {
            const { error } = await client.auth.signUp({
                email: email.value,
                password: password.value,
            });
            if (error) throw error;
            errorMsg.value = "Success! Please check your email to confirm your account.";
        } catch (error) {
            errorMsg.value = error.message;
        }
    }

</script>

<template>
    <div class="flex justify-center items-center w-full h-[100vh]">
        <div class="flex items-center flex-col bg-zinc-900 shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] mt-[1rem] p-[2rem] rounded-lg">
            <img :src="logo" class="w-[3rem] "/>
            <div class="text-[2rem] text-zinc-300 mt-[1rem]">{{ sign === 'in' ? 'Sign In' : 'Register' }} with email</div>
            <div v-if="errorMsg" class="text-red-500 mt-2 text-center">{{ errorMsg }}</div>
            <div class="mt-[2rem]">
                <form class="flex flex-col gap-[1rem]" @submit.prevent="sign === 'in' ? signIn() : signUp()">
                    <div class="flex flex-row items-center bg-zinc-600 p-[0.5rem] gap-[0.5rem] rounded-lg">
                        <Icon name="ic:round-email" class="w-[1rem] bg-neutral-300"/>
                        <input v-model="email" class="bg-zinc-600 outline-none w-[20rem] text-zinc-300 h-[2rem]" required placeholder="email" type="email"/>
                    </div>
                    <div class="flex flex-row items-center bg-zinc-600 p-[0.5rem] gap-[0.5rem] rounded-lg">
                        <Icon name="tabler:lock-filled" class="w-[1rem] bg-neutral-300"/>
                        <input v-model="password" class="bg-zinc-600 outline-none w-[20rem] text-zinc-300 h-[2rem]" required placeholder="password" type="password"/>
                    </div>
                    <button type="submit" class="flex items-center justify-center bg-zinc-500 text-zinc-300 hover:bg-red-500 hover:text-white duration-75 rounded-lg h-[2rem]">
                        {{ sign === 'in' ? 'Login' : 'Register' }}
                    </button>

                </form>
            </div>
            <div class="text-neutral-400 mt-[1rem]">
                <template v-if="sign === 'in'">
                    Don't have an account? <span class="text-neutral-500 hover:text-red-500 cursor-pointer" @click="sign = 'up'; errorMsg = null">Register</span>
                </template>
                <template v-else>
                    Already have an account? <span class="text-neutral-500 hover:text-red-500 cursor-pointer" @click="sign = 'in'; errorMsg = null">Sign In</span>
                </template>
            </div>
        </div>
    </div>
</template>