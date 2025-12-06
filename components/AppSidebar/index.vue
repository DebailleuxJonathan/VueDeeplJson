<script setup lang="ts">
import NavMain from "~/components/AppSidebar/NavMain.vue";

const items = ref([
  {
    title: "Home",
    path: "/dashboard/home",
    icon : "material-symbols-light:home-outline"
  }, {
    title: "Overview",
    path: "/dashboard/overview",
    icon: "material-symbols-light:dashboard-outline"
  }, {
    title: "Translations",
    path: "/dashboard/translate",
    icon: "material-symbols-light:translate"
  }, {
    title: "Help",
    path: "/dashboard/help",
    icon: "material-symbols-light:help-outline"
  }
])
</script>
<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <Logo />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items=items />
    </SidebarContent>
    <SidebarFooter>
<!--      <NavUser user={data.user} />-->
      <UserItem />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
