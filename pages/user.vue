<template>
  <div class="container">
    <Upload />
  </div>
</template>

<script>
import Upload from '~/components/Upload'
export default {
  components: {
    Upload
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 90%;
  margin: 5% auto;
}
</style>
