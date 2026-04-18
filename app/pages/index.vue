<template>
    <div class="bg-[url(/index/parchment.jpg)] bg-cover w-full min-h-screen">
        <h1 class="font-whisper text-9xl text-center p-12">
            MagiHome
        </h1>

        <!-- minigame links -->
        <div class="w-screen md:w-1/2 flex flex-col absolute m-auto left-0 right-0">
            <NuxtLink to="/games/hotPotato" class="relative">
                <img src="/index/oldBanner1.png" alt="" class="w-full">
                <p class="absolute m-auto top-0 left-0 right-0 bottom-0 text-center h-12 text-5xl font-whisper">Hot Potato</p>
            </NuxtLink>
            <NuxtLink to="" class="relative">
                <img src="/index/oldBanner1.png" alt="" class="w-full">
                <p class="absolute m-auto top-0 left-0 right-0 bottom-0 text-center h-12 text-5xl font-whisper">Quick Draw</p>
            </NuxtLink>
        </div>
        
        <!-- <img src="/index/oldBanner2.webp" alt=""> -->
    </div>
</template>