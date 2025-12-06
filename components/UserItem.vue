<script setup lang='ts'>
import {useSidebar} from "~/components/ui/sidebar";

const user = useSupabaseUser()
const {isMobile} = useSidebar()

</script>
<template>
    <DropdownMenu>
      <DropdownMenuTrigger class="w-full p-4">
        <div class="flex items-start w-full gap-2 p-3 border border-gray-900 bg-gray-900 rounded-md hover:bg-gray-800 cursor-pointer transition duration-300">
          <div class="flex flex-col items-start w-full pointer-events-none">
            <p class="w-full font-bold truncate">{{ user?.name ?? user?.email }}</p>
            <p class="font-light text-gray-300 text-xs truncate">{{ user?.email }}</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56 -mb-3">
        <ProfileMenu :user="user" />
      </DropdownMenuContent>
    </DropdownMenu>
</template>
