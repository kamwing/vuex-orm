import { Store } from 'vuex'
import { Record, Records } from '../data/Data'
import Model from '../model/Model'
import Constructor from '../model/Constructor'

export default class Connection<M extends Model> {
  /**
   * The store instance.
   */
  store: Store<any>

  /**
   * The model object.
   */
  model: Constructor<M>

  /**
   * Create a new connection instance.
   */
  constructor(store: Store<any>, model: Constructor<M>) {
    this.store = store
    this.model = model
  }

  /**
   * Get all existing records.
   */
  get(): Records {
    const namespace = this.store.$database.connection
    const entity = this.model.entity

    return this.store.state[namespace][entity].data
  }

  /**
   * Find a model by its primary key.
   */
  find(id: string | number): Record | null {
    const namespace = this.store.$database.connection
    const entity = this.model.entity

    return this.store.state[namespace][entity].data[id] ?? null
  }

  /**
   * Find multiple models by their primary keys.
   */
  findIn(ids: string[]): Record[] {
    const namespace = this.store.$database.connection
    const entity = this.model.entity
    const data = this.store.state[namespace][entity].data

    return ids.map((id) => data[id])
  }

  /**
   * Commit the store mutation.
   */
  private commit(name: string, payload?: any): void {
    const namespace = this.store.$database.connection
    const entity = this.model.entity

    this.store.commit(`${namespace}/${entity}/${name}`, payload)
  }

  /**
   * Commit `insert` change to the store.
   */
  insert(records: Record[]): void {
    this.commit('insert', this.mapRecords(records))
  }

  /**
   * Commit `update` change to the store.
   */
  update(records: Record[]): void {
    this.commit('update', this.mapRecords(records))
  }

  /**
   * Convert the given array of records into records.
   */
  private mapRecords(records: Record[]): Records {
    return records.reduce<Records>((carry, record) => {
      carry[this.model.getIndexId(record)] = record
      return carry
    }, {})
  }

  /**
   * Commit `delete` change to the store.
   */
  delete(ids: string[]): void {
    this.commit('delete', ids)
  }

  /**
   * Commit `deleteAll` change to the store.
   */
  deleteAll(): void {
    this.commit('deleteAll')
  }
}
