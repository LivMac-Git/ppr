<template>
  <v-card flat>
    <v-text-field
      v-model="serialNumber"
      label="Serial number"
      hint="We can provide a helpful hint here ..."
      :rules="validationRules"
      required
    />
    <v-btn
      id="serach-btn"
      color="primary"
      :disabled="!formValid"
      @click="doSearch"
    >
      Search
    </v-btn>
    <v-banner
      v-show="errorMessage"
      single-line
    >
      {{ errorMessage }}
    </v-banner>
  </v-card>
</template>

<script lang="ts">
import {computed, createComponent, ref} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/ts-api/component"
import {useLoadIndicator} from "@/load-indicator"
import {useRouter} from '@/router/router'
import {useSearcherSerial} from '@/search/search-serial'

export default createComponent({
  setup(): Data {
    const loadIndicator = useLoadIndicator()
    const searcherSerial = useSearcherSerial()
    const {router} = useRouter()

    const serialNumber = ref<string>('')
    const errorMessage = ref<string>('')

    const validationRules = computed(() => {
      return searcherSerial.validationRules
    })
    const formValid = computed(() => {
      return searcherSerial.isValid(serialNumber.value)
    })

    function doSearch(): void {
      loadIndicator.start()
      errorMessage.value = ''
      searcherSerial.doSearch(serialNumber.value)
        .then((): void => {
          router.push('results')
        })
        .catch( (eMessage): void => {
          errorMessage.value = eMessage
        })
        .finally(() => {
          loadIndicator.stop()
        })
    }

    return {
      doSearch,
      errorMessage,
      formValid,
      serialNumber,
      validationRules
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
