// import { Entity } from "./entity";
// import { DomainEvent } from "./domain-event.interface";

// /**
//  * Base Aggregate Root Class
//  * 
//  * Aggregate Root is the entry point to an aggregate.
//  * All external references to entities within the aggregate go through the root.
//  * 
//  * Design Pattern: Aggregate Root (DDD)
//  * Time Complexity: O(1) for event management
//  * Space Complexity: O(n) where n = pending domain events
//  * 
//  * Rules:
//  * 1. Aggregate root enforces invariants for the entire aggregate
//  * 2. External objects reference only the aggregate root
//  * 3. Aggregate root can hold references to internal entities
//  * 4. Changes to internal entities go through the aggregate root
//  */

// export abstract class AggregateRoot<T> extends Entity<T> {
//   private _domainEvents: DomainEvent[] = [];

//   /**
//    * Get all pending domain events (defensive copy)
//    * O(n) where n = number of events
//    */
//   get domainEvents(): ReadonlyArray<DomainEvent> {
//     return [...this._domainEvents];
//   }

//   /**
//    * Add a domain event to the pending list
//    * O(1) - array push
//    * 
//    * Events are collected during a transaction and dispatched after commit.
//    * This ensures all side effects happen atomically.
//    */
//   protected addDomainEvent(event: DomainEvent): void {
//     this._domainEvents.push(event);
//   }

//   /**
//    * Remove a specific domain event
//    * O(n) where n = number of events (find + splice)
//    */
//   protected removeDomainEvent(event: DomainEvent): void {
//     const index = this._domainEvents.findIndex((e) => e === event);
//     if (index !== -1) {
//       this._domainEvents.splice(index, 1);
//     }
//   }

//   /**
//    * Clear all pending domain events
//    * O(1) - array clear
//    * 
//    * Called after events are successfully dispatched.
//    */
//   public clearEvents(): void {
//     this._domainEvents = [];
//   }

//   /**
//    * Check if there are pending events
//    * O(1)
//    */
//   public hasEvents(): boolean {
//     return this._domainEvents.length > 0;
//   }

//   /**
//    * Count pending events
//    * O(1)
//    */
//   public eventCount(): number {
//     return this._domainEvents.length;
//   }
// }

// /**
//  * Domain Event Interface
//  * 
//  * Represents something that happened in the domain.
//  * Events are immutable and named in past tense.
//  */
// export interface DomainEvent {
//   readonly eventName: string;
//   readonly occurredAt: Date;
//   readonly aggregateId: string;
//   toPrimitives(): Record<string, unknown>;
// }