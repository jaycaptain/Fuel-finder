'use client';

import type { GQLSearchResult, Maybe } from '@fuel-explorer/graphql';
import type { BaseProps, InputProps } from '@fuels/ui';
import {
  Box,
  Dropdown,
  Focus,
  Icon,
  IconButton,
  Input,
  Link,
  Portal,
  Text,
  Tooltip,
  VStack,
  shortAddress,
  useBreakpoints,
} from '@fuels/ui';
import { IconCheck, IconSearch, IconX } from '@tabler/icons-react';
import NextLink from 'next/link';
import type { KeyboardEvent, RefObject } from 'react';
import { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Routes } from '~/routes';

import { cx } from '../../utils/cx';

import { useRouter } from 'next/navigation';
import { SearchContext } from './SearchWidget';
import { styles } from './styles';

const DEFAULT_WIDTH = 400;

type SearchDropdownProps = {
  searchResult?: Maybe<GQLSearchResult>;
  openDropdown: boolean;
  isFocused: boolean;
  onOpenChange: (open: boolean) => void;
  searchValue: string;
  width: number;
  onSelectItem: () => void;
};

// Radix's Dropdown component uses a Portal to render the dropdown content,
// That causes Input to not capture click events, forcing the user to double click the input when the dropdown is open.
// To fix that we need to render a separate Portal to render the overlay and capture the click to make it work.
function InputDropdownOverlay({
  containerRef,
  inputRef,
}: {
  containerRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
}) {
  const boundingData = containerRef.current?.getBoundingClientRect();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boundingData) {
        const { clientX, clientY } = e;
        if (
          clientX >= boundingData.x &&
          clientX <= boundingData.x + boundingData.width &&
          clientY >= boundingData.y &&
          clientY <= boundingData.y + boundingData.height
        ) {
          inputRef.current?.focus();
        }
      }
    };
    document.addEventListener('click', onClick);

    return () => {
      setTimeout(() => {
        document.removeEventListener('click', onClick);
      }, 500);
    };
  }, []);

  if (!boundingData) {
    return null;
  }
  const { x, y, width, height } = boundingData;

  return (
    <Portal>
      <div
        style={{
          top: y,
          left: x,
          width: width,
          height: height,
        }}
        aria-hidden
        className="fixed cursor-text"
      />
    </Portal>
  );
}

const SearchResultDropdown = forwardRef<HTMLDivElement, SearchDropdownProps>(
  (
    {
      searchResult,
      searchValue,
      openDropdown,
      onOpenChange,
      width,
      onSelectItem,
      isFocused,
    },
    ref,
  ) => {
    const router = useRouter();

    function onClick(href: string | undefined) {
      onSelectItem?.();
      if (href) {
        router.push(href);
      }
    }
    const classes = styles();
    const { isMobile } = useBreakpoints();
    const trimL = isMobile ? 15 : 20;
    const trimR = isMobile ? 13 : 18;

    const hasResult =
      searchResult?.account ||
      searchResult?.block ||
      searchResult?.contract ||
      searchResult?.transaction;

    return (
      <Dropdown open={openDropdown} onOpenChange={onOpenChange}>
        <Dropdown.Trigger>
          <Box className="w-full" />
        </Dropdown.Trigger>
        <Dropdown.Content
          ref={ref}
          style={{ width }}
          data-active={isFocused || openDropdown}
          className={cx(
            classes.dropdownContent(openDropdown),
            classes.searchSize(),
          )}
        >
          {!searchResult && (
            <>
              <Dropdown.Item className="hover:bg-transparent focus:bg-transparent text-error hover:text-error focus:text-error">
                {`"${shortAddress(
                  searchValue,
                  trimL,
                  trimR,
                )}" is not a valid address.`}
              </Dropdown.Item>
            </>
          )}
          {hasResult ? (
            <>
              {searchResult?.account && (
                <>
                  <Dropdown.Label>Account</Dropdown.Label>
                  <Dropdown.Item
                    className={classes.dropdownItem()}
                    onClick={() =>
                      searchResult.account?.address &&
                      onClick(
                        Routes.accountAssets(searchResult.account.address!),
                      )
                    }
                  >
                    <Link
                      as={NextLink}
                      href={Routes.accountAssets(searchResult.account.address!)}
                      onClick={onSelectItem}
                    >
                      {shortAddress(
                        searchResult.account.address || '',
                        trimL,
                        trimR,
                      )}
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Separator />
                  <Dropdown.Label>Recent Transactions</Dropdown.Label>
                  {searchResult.account.transactions?.map((transaction) => {
                    return (
                      <Dropdown.Item
                        key={transaction?.id}
                        className={classes.dropdownItem()}
                        onClick={() =>
                          transaction?.id &&
                          onClick(Routes.txSimple(transaction?.id))
                        }
                      >
                        <Link
                          as={NextLink}
                          href={Routes.txSimple(transaction?.id!)}
                          onClick={onSelectItem}
                        >
                          {shortAddress(transaction?.id || '', trimL, trimR)}
                        </Link>
                      </Dropdown.Item>
                    );
                  })}
                </>
              )}
              {searchResult?.block && (
                <>
                  {searchResult.block.id === searchValue && (
                    <>
                      <Dropdown.Label>Block Hash</Dropdown.Label>
                      <Dropdown.Item
                        className={classes.dropdownItem()}
                        onClick={() =>
                          searchResult.block?.id &&
                          onClick(`/block/${searchResult.block.id}/simple`)
                        }
                      >
                        <Link
                          as={NextLink}
                          href={`/block/${searchResult.block.id}/simple`}
                          onClick={onSelectItem}
                        >
                          {shortAddress(
                            searchResult.block.id || '',
                            trimL,
                            trimR,
                          )}
                        </Link>
                      </Dropdown.Item>
                    </>
                  )}
                  {searchResult.block.height === searchValue && (
                    <>
                      <Dropdown.Label>Block Height</Dropdown.Label>
                      <Dropdown.Item
                        className={classes.dropdownItem()}
                        onClick={() =>
                          searchResult.block?.height &&
                          onClick(`/block/${searchResult.block?.height}/simple`)
                        }
                      >
                        <Link
                          as={NextLink}
                          href={`/block/${searchResult.block.height}/simple`}
                          onClick={onSelectItem}
                        >
                          {searchResult.block.height}
                        </Link>
                      </Dropdown.Item>
                    </>
                  )}
                </>
              )}
              {searchResult?.contract && (
                <>
                  <Dropdown.Label>Contract</Dropdown.Label>
                  <Dropdown.Item
                    className={classes.dropdownItem()}
                    onClick={() =>
                      searchResult.contract?.id &&
                      onClick(Routes.contractAssets(searchResult.contract.id))
                    }
                  >
                    <Link
                      as={NextLink}
                      href={Routes.contractAssets(searchResult.contract.id!)}
                      onClick={onSelectItem}
                    >
                      {shortAddress(
                        searchResult.contract.id || '',
                        trimL,
                        trimR,
                      )}
                    </Link>
                  </Dropdown.Item>
                </>
              )}
              {searchResult?.transaction && (
                <>
                  <Dropdown.Label>Transaction</Dropdown.Label>
                  <Dropdown.Item
                    className={classes.dropdownItem()}
                    onClick={() =>
                      searchResult.transaction?.id &&
                      onClick(Routes.txSimple(searchResult.transaction?.id))
                    }
                  >
                    <Link
                      as={NextLink}
                      href={Routes.txSimple(searchResult.transaction.id!)}
                      onClick={onSelectItem}
                    >
                      {shortAddress(
                        searchResult.transaction.id || '',
                        trimL,
                        trimR,
                      )}
                    </Link>
                  </Dropdown.Item>
                </>
              )}
            </>
          ) : (
            <>
              <Dropdown.Label>No instances found for:</Dropdown.Label>
              <Text className="px-3 text-sm pb-1">
                &quot;{shortAddress(searchValue, trimL, trimR)}&quot;
              </Text>
            </>
          )}
        </Dropdown.Content>
      </Dropdown>
    );
  },
);

type SearchInputProps = BaseProps<InputProps> & {
  onSubmit?: (value: string) => void;
  searchResult?: Maybe<GQLSearchResult>;
  alwaysDisplayActionButtons?: boolean;
};

export function SearchInput({
  value: initialValue = '',
  className,
  autoFocus,
  placeholder = 'Search here...',
  searchResult,
  ...props
}: SearchInputProps) {
  const classes = styles();
  const [value, setValue] = useState<string>(initialValue as string);
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { pending } = useFormStatus();
  const { dropdownRef } = useContext(SearchContext);
  const openDropdown = hasSubmitted
    ? !pending
    : isOpen && !pending && !!searchResult;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  function handleSubmit() {
    setIsOpen(true);
    setHasSubmitted(true);
  }

  function close() {
    setIsOpen(false);
    setHasSubmitted(false);
  }

  function handleClear() {
    setValue('');
    close();
  }

  function handleFocus() {
    setIsFocused(true);
  }

  function handleBlur() {
    setIsFocused(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLFormElement).form?.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true }),
      );
      handleSubmit();
    }
  }

  return (
    <div className="relative">
      <VStack
        gap="0"
        className={classes.searchBox()}
        data-active={isFocused || openDropdown}
      >
        <Focus.ArrowNavigator autoFocus={autoFocus}>
          <div ref={containerRef} className={classes.inputContainer()}>
            <Input
              {...props}
              ref={inputRef}
              name="query"
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              variant="surface"
              radius="large"
              size="3"
              data-active={isFocused || openDropdown}
              className={cx(className, classes.inputWrapper())}
              type="search"
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={onKeyDown}
            >
              {openDropdown && (
                <InputDropdownOverlay
                  containerRef={containerRef}
                  inputRef={inputRef}
                />
              )}
              <div
                data-show={isFocused}
                className={classes.inputActionsContainer()}
              >
                <Input.Slot side="right">
                  <Tooltip content="Submit">
                    <IconButton
                      type="submit"
                      aria-label="Submit"
                      icon={IconCheck}
                      iconColor="text-brand"
                      variant="link"
                      className="!ml-0 tablet:ml-2"
                      isLoading={pending}
                      onClick={handleSubmit}
                    />
                  </Tooltip>
                  <IconButton
                    aria-label="Clear"
                    icon={IconX}
                    iconColor="text-gray-11"
                    variant="link"
                    className="m-0"
                    onClick={handleClear}
                  />
                </Input.Slot>
              </div>

              <Input.Slot
                data-show={!isFocused}
                side="right"
                className="[&[data-show=false]]:hidden"
              >
                <Icon icon={IconSearch} size={16} />
              </Input.Slot>
            </Input>
          </div>
        </Focus.ArrowNavigator>
        <SearchResultDropdown
          ref={dropdownRef}
          width={containerRef.current?.offsetWidth || DEFAULT_WIDTH}
          searchResult={searchResult}
          searchValue={value}
          openDropdown={openDropdown}
          isFocused={isFocused}
          onSelectItem={() => {
            handleClear();
          }}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              close();
            }
          }}
        />
      </VStack>
    </div>
  );
}
