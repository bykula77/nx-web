/**
 * Delete user command
 */
export interface DeleteUserCommand {
  /** User ID to delete */
  id: string;
  /** ID of the user performing the deletion (actor) */
  actorId: string;
}

/**
 * Delete user result
 */
export interface DeleteUserResult {
  id: string;
  deleted: boolean;
}

