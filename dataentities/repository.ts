/**
 * dataentities/repository.ts
 * Defines the Repository data representation object.
 * @author zixian92
 */

export default class Repository {
  private readonly _owner: string;
  private readonly _name: string;

  constructor(readonly ownername: string, readonly reponame: string){
    this._owner = ownername;
    this._name = reponame;
  }

  get owner(): string {
    return this._owner;
  }

  get name(): string {
    return this._name;
  }
}
