 <template>
  <div class="min-h-screen min-width-screen">
    <NuxtLink v-if="$route.path !== '/'" to="/" class="z-50 absolute top-0 left-0 font-whisper text-4xl p-4">MH</NuxtLink>
    <NuxtPage />
  </div>
</template>
