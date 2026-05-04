import { ref } from 'vue'
import { bookListService } from '@/api/book'
import { getBookCategory } from '@/api/bookCategory'
import type { Book, BookCategory as BookCategoryType } from '@/types/book'
import { usePagination } from './usePagination'

export function useBookList() {
  const books = ref<Book[]>([])
  const categories = ref<BookCategoryType[]>([])
  const loading = ref(false)

  const title = ref('')
  const categoryId = ref('')
  const state = ref('')
  const username = ref('')
  const sortBy = ref('')

  const { pageNum, total, pageSize, onSizeChange, onCurrentChange, reset, setTotal } = usePagination()

  async function loadCategories() {
    const res = await getBookCategory()
    categories.value = res.data
  }

  async function loadBooks(paramsExtra?: Record<string, string | null>) {
    loading.value = true
    try {
      const params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value || null,
        title: title.value || null,
        state: state.value || null,
        username: username.value || null,
        bookName: null,
        sortBy: sortBy.value || null,
        ...paramsExtra,
      }
      const res = await bookListService(params)
      books.value = res.data.items

      // Enrich with categoryName
      for (const book of books.value) {
        const cat = categories.value.find(c => c.id === Number(book.categoryId))
        if (cat) book.categoryName = cat.categoryName
      }

      setTotal(res.data.total)
    } finally {
      loading.value = false
    }
  }

  return {
    books, categories, loading,
    title, categoryId, state, username, sortBy,
    pageNum, total, pageSize,
    loadCategories, loadBooks,
    onSizeChange: (s: number) => { onSizeChange(s); loadBooks() },
    onCurrentChange: (n: number) => { onCurrentChange(n); loadBooks() },
    reset,
  }
}
