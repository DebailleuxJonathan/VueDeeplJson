<script setup lang='ts'>

const props = defineProps<{
  items: any
}>()
</script>
<template>
  <SidebarGroup>
    <SidebarMenu v-for="item in props.items">
        <SidebarMenuItem>
          <SidebarMenuButton :tooltip=item.title>
            <Icon size="20" :name="item.icon" />
            <span>{{ item.title }}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
