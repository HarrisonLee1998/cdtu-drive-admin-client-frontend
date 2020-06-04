<template>
  <div class="container">
    <div class="stats-by-type">
      <StatsByType />
    </div>
    <div class="stats-by-dept">
      <StatsByDept />
    </div>
  </div>
</template>

<script>
import StatsByType from '~/components/stats/StatsByType'
import StatsByDept from '~/components/stats/StatsByDept'
export default {
  components: {
    StatsByType,
    StatsByDept
  }
}
</script>

<style>
.container {
  width: 90%;
  margin: 5% auto;
}
</style>
