/*
 * @ordius/adonisjs-cursor-pagination
 *
 * (c) Mixxtor Radcliffe <mixxtor@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { LucidModel, LucidRow } from '@adonisjs/lucid/types/model'
import type {
  CursorPaginatorContract,
  ModelCursorPaginatorContract,
  TCursorPaginateOptions,
  TCursorPaginateParams,
} from './types.js'

/**
 * Database query builder cursor pagination macros
 */
interface DatabaseQueryBuilderCursorMacros<Result extends InstanceType<LucidModel>> {
  /**
   * Paginate query results using a cursor (object-based API).
   *
   * @param params - The cursor pagination parameters.
   */
  cursorPaginate<R extends Result>(
    params: TCursorPaginateParams<R>
  ): Promise<CursorPaginatorContract<R>>

  /**
   * Paginate query results using a cursor (positional API - legacy).
   *
   * @param perPage - The maximum number of records to return per page.
   * @param cursor - The cursor value to start from.
   * @param options - The options for cursor pagination.
   */
  cursorPaginate<R extends Result>(
    perPage: number,
    cursor?: string | null,
    options?: TCursorPaginateOptions<R>
  ): Promise<CursorPaginatorContract<R>>
}

/**
 * Model query builder cursor pagination macros
 */
interface ModelQueryBuilderCursorMacros<
  Model extends LucidModel,
  Result extends InstanceType<Model> = InstanceType<Model>,
> {
  /**
   * Paginate query results using a cursor (object-based API).
   *
   * @param params - The cursor pagination parameters.
   */
  cursorPaginate(
    params: TCursorPaginateParams<Result>
  ): Promise<
    Result extends LucidRow ? ModelCursorPaginatorContract<Result> : CursorPaginatorContract<Result>
  >

  /**
   * Paginate query results using a cursor (positional API - legacy).
   *
   * @param perPage - The maximum number of records to return per page.
   * @param cursor - The cursor value to start from.
   * @param options - The options for cursor pagination.
   */
  cursorPaginate(
    perPage: number,
    cursor?: string | null,
    options?: TCursorPaginateOptions<Result>
  ): Promise<
    Result extends LucidRow ? ModelCursorPaginatorContract<Result> : CursorPaginatorContract<Result>
  >
}

declare module '@adonisjs/lucid/types/querybuilder' {
  interface DatabaseQueryBuilderContract<
    Result extends InstanceType<LucidModel>,
  > extends DatabaseQueryBuilderCursorMacros<Result> {}
}

declare module '@adonisjs/lucid/database' {
  interface DatabaseQueryBuilder extends DatabaseQueryBuilderCursorMacros<
    InstanceType<LucidModel>
  > {}
}

declare module '@adonisjs/lucid/types/model' {
  interface ModelQueryBuilderContract<
    Model extends LucidModel,
    Result extends InstanceType<Model>,
  > extends ModelQueryBuilderCursorMacros<Model, Result> {}
}

declare module '@adonisjs/lucid/orm' {
  interface ModelQueryBuilder extends ModelQueryBuilderCursorMacros<LucidModel> {}
}
