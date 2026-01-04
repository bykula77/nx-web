import type { SupabaseClient } from '@supabase/supabase-js';
import type { IUserRepository } from '../ports/user.repository.port';
import type { User } from '../types/user.entity';
import type { CreateUserDTO, UpdateUserDTO, UserFilterDTO, UserPaginationDTO } from '../types/user.dto';
import { UserRole, UserStatus, DEFAULT_USER_ROLE, DEFAULT_USER_STATUS, DEFAULT_PAGE_SIZE } from '../types';

const USERS_TABLE = 'users';

/**
 * Supabase implementation of user repository
 */
export class UserSupabaseAdapter implements IUserRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from(USERS_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapToUser(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from(USERS_TABLE)
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapToUser(data);
  }

  async findAll(
    filter?: UserFilterDTO,
    pagination?: UserPaginationDTO
  ): Promise<{ items: User[]; total: number }> {
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? DEFAULT_PAGE_SIZE;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = this.supabase
      .from(USERS_TABLE)
      .select('*', { count: 'exact' });

    // Apply filters
    if (filter?.search) {
      query = query.or(
        `email.ilike.%${filter.search}%,full_name.ilike.%${filter.search}%`
      );
    }

    if (filter?.role) {
      query = query.eq('role', filter.role);
    }

    if (filter?.status) {
      query = query.eq('status', filter.status);
    }

    if (filter?.createdAfter) {
      query = query.gte('created_at', filter.createdAfter.toISOString());
    }

    if (filter?.createdBefore) {
      query = query.lte('created_at', filter.createdBefore.toISOString());
    }

    // Apply sorting
    const sortBy = pagination?.sortBy ?? 'createdAt';
    const sortOrder = pagination?.sortOrder ?? 'desc';
    const sortColumn = this.toSnakeCase(sortBy as string);
    query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return {
      items: (data ?? []).map(this.mapToUser),
      total: count ?? 0,
    };
  }

  async create(dto: CreateUserDTO): Promise<User> {
    const { data, error } = await this.supabase
      .from(USERS_TABLE)
      .insert({
        email: dto.email.toLowerCase(),
        full_name: dto.fullName,
        role: dto.role ?? DEFAULT_USER_ROLE,
        status: DEFAULT_USER_STATUS,
        avatar_url: dto.avatarUrl,
        phone: dto.phone,
        metadata: dto.metadata,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create user: ${error?.message}`);
    }

    return this.mapToUser(data);
  }

  async update(id: string, dto: UpdateUserDTO): Promise<User> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (dto.email !== undefined) {
      updateData.email = dto.email.toLowerCase();
    }
    if (dto.fullName !== undefined) {
      updateData.full_name = dto.fullName;
    }
    if (dto.role !== undefined) {
      updateData.role = dto.role;
    }
    if (dto.status !== undefined) {
      updateData.status = dto.status;
    }
    if (dto.avatarUrl !== undefined) {
      updateData.avatar_url = dto.avatarUrl;
    }
    if (dto.phone !== undefined) {
      updateData.phone = dto.phone;
    }
    if (dto.metadata !== undefined) {
      updateData.metadata = dto.metadata;
    }

    const { data, error } = await this.supabase
      .from(USERS_TABLE)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update user: ${error?.message}`);
    }

    return this.mapToUser(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(USERS_TABLE)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    let query = this.supabase
      .from(USERS_TABLE)
      .select('id')
      .eq('email', email.toLowerCase());

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data } = await query.maybeSingle();
    return !!data;
  }

  async count(filter?: UserFilterDTO): Promise<number> {
    let query = this.supabase
      .from(USERS_TABLE)
      .select('*', { count: 'exact', head: true });

    if (filter?.role) {
      query = query.eq('role', filter.role);
    }

    if (filter?.status) {
      query = query.eq('status', filter.status);
    }

    const { count } = await query;
    return count ?? 0;
  }

  /**
   * Map database row to User entity
   */
  private mapToUser(row: Record<string, unknown>): User {
    return {
      id: row.id as string,
      email: row.email as string,
      fullName: row.full_name as string,
      role: row.role as UserRole,
      status: row.status as UserStatus,
      avatarUrl: row.avatar_url as string | undefined,
      phone: row.phone as string | undefined,
      metadata: row.metadata as Record<string, unknown> | undefined,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
      lastLoginAt: row.last_login_at
        ? new Date(row.last_login_at as string)
        : undefined,
    };
  }

  /**
   * Convert camelCase to snake_case
   */
  private toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}

