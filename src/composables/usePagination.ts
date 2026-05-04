import { ref } from 'vue'

export function usePagination(pageSizeDefault = 5) {
  const pageNum = ref(1)
  const total = ref(0)
  const pageSize = ref(pageSizeDefault)

  function onSizeChange(size: number) {
    pageSize.value = size
    pageNum.value = 1
  }

  function onCurrentChange(num: number) {
    pageNum.value = num
  }

  function reset() {
    pageNum.value = 1
  }

  function setTotal(n: number) {
    total.value = n
  }

  return { pageNum, total, pageSize, onSizeChange, onCurrentChange, reset, setTotal }
}
