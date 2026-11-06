"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { ManagedUser, NewUser, UserCatalogOption } from "../models/auth";
import {
  AuthApiError,
  createManagedUser,
  getUserManagementOptions,
  listManagedUsers,
} from "../services/auth.service";

const emptyForm = {
  nombre: "",
  usuario: "",
  password: "",
  id_rol: "",
  id_sucursal: "",
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
}

export default function UserManagementPanel() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [roles, setRoles] = useState<UserCatalogOption[]>([]);
  const [branches, setBranches] = useState<UserCatalogOption[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadPanelData = useCallback(async () => {
    setError(null);
    try {
      const [userRows, options] = await Promise.all([
        listManagedUsers(),
        getUserManagementOptions(),
      ]);
      setUsers(userRows);
      setRoles(options.roles);
      setBranches(options.sucursales);
      setForm((current) => ({
        ...current,
        id_rol: current.id_rol || String(options.roles[0]?.id ?? ""),
        id_sucursal: current.id_sucursal || String(options.sucursales[0]?.id ?? ""),
      }));
    } catch (loadError: unknown) {
      if (loadError instanceof AuthApiError && loadError.status === 401) {
        setError("Tu sesión expiró. Cierra sesión e ingresa nuevamente.");
      } else {
        setError(errorMessage(loadError));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPanelData();
  }, [loadPanelData]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const newUser: NewUser = {
      nombre: form.nombre.trim(),
      usuario: form.usuario.trim(),
      password: form.password,
      id_rol: Number(form.id_rol),
      id_sucursal: Number(form.id_sucursal),
    };

    try {
      await createManagedUser(newUser);
      setForm(emptyForm);
      setSuccess("El usuario se creó correctamente.");
      await loadPanelData();
    } catch (submitError: unknown) {
      setError(errorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="gc-content-stack">
      <section className="gc-section-intro">
        <div>
          <span className="gc-kicker">ADMINISTRACIÓN</span>
          <h2>Gestión de usuarios</h2>
          <p>Agrega usuarios y asigna su rol y sucursal.</p>
        </div>
        <span className="gc-count-badge">{users.length} USUARIOS</span>
      </section>

      {error && <p className="gc-user-feedback is-error" role="alert">{error}</p>}
      {success && <p className="gc-user-feedback is-success" role="status">{success}</p>}

      <section className="gc-panel-card gc-user-create">
        <div className="gc-panel-heading">
          <div>
            <span className="gc-kicker">NUEVA CUENTA</span>
            <h3>Agregar usuario</h3>
          </div>
        </div>
        <form className="gc-user-form" onSubmit={handleSubmit}>
          <label>
            Nombre completo
            <input
              autoComplete="name"
              maxLength={150}
              required
              value={form.nombre}
              onChange={(event) => setForm({ ...form, nombre: event.target.value })}
            />
          </label>
          <label>
            Nombre de usuario
            <input
              autoComplete="username"
              maxLength={100}
              required
              value={form.usuario}
              onChange={(event) => setForm({ ...form, usuario: event.target.value })}
            />
          </label>
          <label>
            Contraseña inicial
            <input
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </label>
          <label>
            Rol
            <select
              required
              value={form.id_rol || (roles[0] ? String(roles[0].id) : "")}
              onChange={(event) => setForm({ ...form, id_rol: event.target.value })}
            >
              <option value="" disabled>Selecciona un rol</option>
              {roles.map((role) => <option key={role.id} value={role.id}>{role.nombre}</option>)}
            </select>
          </label>
          <label>
            Sucursal
            <select
              required
              value={form.id_sucursal || (branches[0] ? String(branches[0].id) : "")}
              onChange={(event) => setForm({ ...form, id_sucursal: event.target.value })}
            >
              <option value="" disabled>Selecciona una sucursal</option>
              {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.nombre}</option>)}
            </select>
          </label>
          <button
            className="gc-gold-button"
            disabled={isSubmitting || roles.length === 0 || branches.length === 0}
            type="submit"
          >
            {isSubmitting ? "GUARDANDO..." : "CREAR USUARIO"} <span>+</span>
          </button>
        </form>
        {(!isLoading && roles.length === 0) && <p className="gc-user-feedback is-error">No hay roles disponibles en la tabla rol.</p>}
        {(!isLoading && branches.length === 0) && <p className="gc-user-feedback is-error">No hay sucursales disponibles en la tabla sucursal.</p>}
      </section>

      <section className="gc-panel-card">
        <div className="gc-panel-heading">
          <div>
            <span className="gc-kicker">CUENTAS REGISTRADAS</span>
            <h3>Usuarios</h3>
          </div>
        </div>
        {isLoading ? (
          <p className="gc-user-feedback" role="status">Cargando usuarios...</p>
        ) : users.length === 0 ? (
          <p className="gc-user-feedback">Todavía no hay usuarios registrados.</p>
        ) : (
          <div className="gc-user-table-wrap">
            <table className="gc-user-table">
              <thead>
                <tr><th>Nombre</th><th>Usuario</th><th>Rol</th><th>Sucursal</th></tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id_usuario}>
                    <td>{user.nombre}</td>
                    <td>{user.usuario}</td>
                    <td><span className="gc-user-role">{user.rol}</span></td>
                    <td>{user.sucursal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
