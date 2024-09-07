import GridPostList from '@/components/shared/GridPostList'
import Loader from '@/components/shared/Loader'

import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce'
import { useGetPosts, useSearchPosts } from '@/lib/react-query/queriesAndMutations'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

export type SearchResultProps = {
  isSearchFetching: boolean
  searchedPosts: any
}

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {
  if (isSearchFetching) {
    return <Loader />
  }if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />
  }
    return <p className="mt-10 w-full text-center text-light-4">No results found</p>
}

const Explore = () => {
  const { ref, inView } = useInView()
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts()

  const [searchValue, setSearchValue] = useState('')
  const debouncedSearch = useDebounce(searchValue, 500)
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedSearch)

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView, searchValue])

  if (!posts)
    return (
      <div className="h-full w-full flex-center">
        <Loader />
      </div>
    )

  const shouldShowSearchResults = searchValue !== ''
  const shouldShowPosts =
    !shouldShowSearchResults && posts.pages.every((item) => item.documents.length === 0)

  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <h2 className='h3-bold md:h2-bold w-full'>Search Posts</h2>
        <div className="flex w-full gap-1 rounded-lg bg-dark-4 px-4">
          <img src='/assets/icons/search.svg' width={24} height={24} alt='search' />
          <Input
            type='text'
            placeholder='Search'
            className='explore-search'
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target
              setSearchValue(value)
            }}
          />
        </div>
      </div>

      <div className="mt-16 mb-7 w-full max-w-5xl flex-between">
        <h3 className='body-bold md:h3-bold'>Popular Today</h3>

        <div className="flex-center cursor-pointer gap-3 rounded-xl bg-dark-3 px-4 py-2">
          <p className='small-medium md:base-medium text-light-2'>All</p>
          <img src='/assets/icons/filter.svg' width={20} height={20} alt='filter' />
        </div>
      </div>

      <div className="flex w-full max-w-5xl flex-wrap gap-9">
        {shouldShowSearchResults ? (
          <SearchResults isSearchFetching={isSearchFetching} searchedPosts={searchedPosts} />
        ) : shouldShowPosts ? (
          <p className="mt-10 w-full text-center text-light-4">End of posts</p>
        ) : (
          posts.pages.map((item, index) => (
            <GridPostList key={`page-${index}`} posts={item.documents} />
          ))
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className='mt-10'>
          <Loader />
        </div>
      )}
    </div>
  )
}

export default Explore
