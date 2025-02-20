'use client';

import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { parseAsString, useQueryState } from 'nuqs';
import { type ComponentProps, type FormEvent, useEffect, useRef, useState } from "react"
import { Input } from '~/components/common/input';
import { cx } from '~/utils/cva';
import { useDebounce } from '~/hooks/useDebounce'; // Thêm Debounce hook

export const SearchForm = ({ className, ...props }: ComponentProps<"form">) => {
  const router = useRouter();
  const [searchQuery] = useQueryState('q', parseAsString.withDefault(''));
  const [query, setQuery] = useState(searchQuery);
  const [isExpanded, setIsExpanded] = useState(!!searchQuery); // Giữ input mở rộng nếu có query
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300); // Debounce 300ms

  // Cập nhật URL khi người dùng thay đổi query
  const updateSearch = () => {
    if (debouncedQuery) {
      router.push(`/?q=${debouncedQuery}`);
    }
  };

  // Gọi updateSearch mỗi khi `debouncedQuery` thay đổi
  useEffect(() => {
    updateSearch();
  }, [debouncedQuery]);

  // Mở rộng input khi click vào icon search
  const handleExpand = () => {
    setIsExpanded(true);
    inputRef.current?.focus();
  };

  // Thu nhỏ chỉ khi query rỗng
  const handleBlur = () => {
    if (!query) {
      setIsExpanded(false);
    }
  };

  return (
    <form
      onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}
      className={cx('flex items-center shrink-0', className)}
      noValidate
      {...props}
    >
      <div className="relative flex">
        <Input
          size="sm"
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools..."
          className={cx(
            'transition-[width,opacity,transform] duration-200 ease-in-out',
            isExpanded ? 'w-32 opacity-100' : 'w-0 opacity-0'
          )}
          onFocus={handleExpand}
          onBlur={handleBlur}
        />

        {/* Giữ icon search hiển thị ngay cả khi input mở rộng */}
        <button
          type="button"
          className="p-1 absolute inset-y-0 right-0 flex items-center text-muted-foreground hover:text-foreground transition-all"
          onClick={handleExpand}
          tabIndex={-1}
          aria-label="Search"
        >
          <SearchIcon className="size-4" />
        </button>
      </div>
    </form>
  );
};
