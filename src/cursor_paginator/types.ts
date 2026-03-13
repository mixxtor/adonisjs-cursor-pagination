/*
 * @ordius/adonisjs-cursor-pagination
 *
 * (c) Mixxtor Radcliffe <mixxtor@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type {
  CherryPick,
  LucidModel,
  LucidRow,
  ModelAttributes,
  ModelObject,
} from '@adonisjs/lucid/types/model'

/**
 * The keys for the cursor paginator meta data
 */
export type CursorPaginatorMetaKeys = {
  total: string
  perPage: string
  currentPage: string

  lastPage?: string
  firstPage?: string
  firstPageUrl?: string
  lastPageUrl?: string

  nextCursor: string
  previousCursor: string

  nextPageUrl: string
  previousPageUrl: string
}

/**
 * Naming strategy interface for cursor pagination
 */
export interface CursorPaginatorNamingStrategy {
  paginationMetaKeys(): CursorPaginatorMetaKeys
}

/**
 * Cursor pagination meta data structure
 */
export interface CursorPaginatorMeta {
  [key: string]: number | string | null | undefined
}

/**
 * Contract for the cursor paginator
 */
export interface CursorPaginatorContract<Result> extends Array<Result> {
  all(): Result[]
  items(): Result[]
  readonly perPage: number
  readonly currentPage: string | undefined | null
  readonly hasPages: boolean
  readonly hasMorePages: boolean
  readonly isEmpty: boolean
  readonly total: number
  readonly hasTotal: boolean
  namingStrategy: CursorPaginatorNamingStrategy
  baseUrl(url: string): this
  queryString(values: Record<string, string>): this
  getUrl(cursor: string): string
  getMeta(): CursorPaginatorMeta
  getNextCursor(): string | undefined | null
  getPreviousCursor(): string | undefined | null
  getNextPageUrl(): string | null
  getPreviousPageUrl(): string | null
  toJSON(): {
    meta: CursorPaginatorMeta
    data: Result[]
  }
}

/**
 * Contract for the model cursor paginator with serialization support
 */
export interface ModelCursorPaginatorContract<Result extends LucidRow> extends Omit<
  CursorPaginatorContract<Result>,
  'toJSON'
> {
  serialize(cherryPick?: CherryPick): {
    meta: CursorPaginatorMeta
    data: ModelObject[]
  }
  toJSON(): {
    meta: CursorPaginatorMeta
    data: ModelObject[]
  }
}

/**
 * Sortable columns configuration with type-safe column names
 */
export type TSortableColumns<M extends LucidRow = LucidRow> = {
  [key in keyof ModelAttributes<M>]?: 'asc' | 'desc'
}

/**
 * Cursor data structure
 * Note: `data` stores the actual column values for cursor comparison, not column names
 */
export type TCursorData<M extends LucidRow = LucidRow> = {
  data: ModelAttributes<M>[keyof ModelAttributes<M>][]
  point_to_next: boolean
}

/**
 * Options for cursor pagination
 */
export type TCursorPaginateOptions<
  Result extends InstanceType<LucidModel> = InstanceType<LucidModel>,
> = {
  /**
   * Columns to order by with their sort direction.
   *
   * NOTE: This overrides any existing orderBy clauses on the query builder.
   * @default `{ [model.primaryKey]: 'asc' }`
   */
  orderBy?: TSortableColumns<Result>

  /**
   * Include total count of records in the response.
   * Set to `false` for better performance on large datasets.
   * @default true
   */
  withTotal?: boolean
}

/**
 * Object-based parameters for cursor pagination (recommended).
 *
 * @example
 * ```typescript
 * await User.query().cursorPaginate({
 *   perPage: 10,
 *   cursor: 'abc123',
 *   orderBy: { id: 'asc', createdAt: 'desc' },
 *   withTotal: false
 * })
 * ```
 */
export type TCursorPaginateParams<
  Result extends InstanceType<LucidModel> = InstanceType<LucidModel>,
> = {
  /**
   * Number of items per page.
   * @default 10
   */
  perPage?: number

  /**
   * The cursor string from a previous pagination result.
   * Pass `null` or omit for the first page.
   */
  cursor?: string | null

  /**
   * Columns to order by with their sort direction.
   *
   * NOTE: This overrides any existing orderBy clauses on the query builder.
   * @default `{ [model.primaryKey]: 'asc' }`
   */
  orderBy?: TSortableColumns<Result>

  /**
   * Include total count of records in the response.
   * Set to `false` for better performance on large datasets.
   * @default true
   */
  withTotal?: boolean
}
