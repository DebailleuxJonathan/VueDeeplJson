<script setup lang='ts'>
const client = useSupabaseClient()
const router = useRouter()

const props = defineProps<{
  user: any
}>()
const colorMode = useColorMode()

const handleLogout = async () => {
  try {
    const {error} = await client.auth.signOut()
    await router.push('/login')
    if (error) throw error
  } catch (e) {
    console.log(e)
  }
}
</script>
<template>
  <div class="px-2">
    <DropdownMenuLabel class="text-xl font-semibold truncate">
      {{ props.user?.email }}
    </DropdownMenuLabel>
    <DropdownMenuLabel class="truncate font-light text-xs -mt-2">{{ props.user?.email }}</DropdownMenuLabel>
    <DropdownMenuSeparator/>
    <NuxtLink href="/account/me">
      <DropdownMenuItem class="gap-2 truncate text-sm cursor-pointer">
        <Icon size="20" name="material-symbols-light:settings-outline"/>
        Configurations
      </DropdownMenuItem>
    </NuxtLink>
    <DropdownMenuSeparator/>
    <DropdownMenuLabel class="flex justify-between  text-sm">
      <p>Theme :</p>
      <div class="flex justify-end">
        <Toggle/>
      </div>
    </DropdownMenuLabel>
    <DropdownMenuSeparator/>
    <DropdownMenuLabel class="text-sm">
      Langue :
    </DropdownMenuLabel>
    <DropdownMenuLabel>
      <LangSwitcher/>
    </DropdownMenuLabel>
    <DropdownMenuSeparator/>
    <DropdownMenuItem @click="handleLogout" class="text-sm cursor-pointer">
      Log out
    </DropdownMenuItem>
  </div>
</template>
