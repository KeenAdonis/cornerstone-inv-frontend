"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Checkbox,
} from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Branch,
  getBranches,
  getWarehouses,
  Warehouse,
} from "@/src/services/assignmentService";

import { useCreateUser } from "@/src/hooks/user/useCreateUser";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type UserRole =
  | ""
  | "admin"
  | "branch_coordinator"
  | "warehouse_coordinator";

type UserStatus = "active" | "inactive";

interface UserFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: UserRole;
  branch_ids: string[];
  warehouse_ids: string[];
  status: UserStatus;
}

const initialFormData: UserFormData = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  role: "",
  branch_ids: [],
  warehouse_ids: [],
  status: "active",
};

export default function AddUserDialog({
  open,
  onOpenChange,
}: AddUserDialogProps) {
  const [formData, setFormData] =
    useState<UserFormData>(initialFormData);

  const [branches, setBranches] =
    useState<Branch[]>([]);

  const [warehouses, setWarehouses] =
    useState<Warehouse[]>([]);

  const [loadingAssignments, setLoadingAssignments] =
    useState(false);

  const [assignmentError, setAssignmentError] =
    useState("");

  const [formError, setFormError] =
    useState("");

  const {
    handleCreateUser,
    loading,
    error,
  } = useCreateUser();

  useEffect(() => {
    async function loadAssignments() {
      try {
        setLoadingAssignments(true);
        setAssignmentError("");

        const [
          branchData,
          warehouseData,
        ] = await Promise.all([
          getBranches(),
          getWarehouses(),
        ]);

        setBranches(branchData);
        setWarehouses(warehouseData);
      } catch {
        setAssignmentError(
          "Unable to load branches and warehouses."
        );
      } finally {
        setLoadingAssignments(false);
      }
    }

    if (open) {
      loadAssignments();
    }
  }, [open]);

  const handleRoleChange = (
    value: UserRole
  ) => {
    setFormData((currentData) => ({
      ...currentData,
      role: value,
      branch_ids: [],
      warehouse_ids: [],
    }));
  };

  const toggleBranch = (
    branchId: string
  ) => {
    setFormData((currentData) => {
      const isSelected =
        currentData.branch_ids.includes(
          branchId
        );

      return {
        ...currentData,
        branch_ids: isSelected
          ? currentData.branch_ids.filter(
              (id) => id !== branchId
            )
          : [
              ...currentData.branch_ids,
              branchId,
            ],
      };
    });
  };

  const toggleWarehouse = (
    warehouseId: string
  ) => {
    setFormData((currentData) => {
      const isSelected =
        currentData.warehouse_ids.includes(
          warehouseId
        );

      return {
        ...currentData,
        warehouse_ids: isSelected
          ? currentData.warehouse_ids.filter(
              (id) => id !== warehouseId
            )
          : [
              ...currentData.warehouse_ids,
              warehouseId,
            ],
      };
    });
  };

  const getBranchLabel = () => {
    if (loadingAssignments) {
      return "Loading branches...";
    }

    if (
      formData.branch_ids.length === 0
    ) {
      return "Select branches";
    }

    if (formData.branch_ids.length === 1) {
      const branch = branches.find(
        (item) =>
          String(item.id) ===
          formData.branch_ids[0]
      );

      return branch
        ? `${branch.name} (${branch.code})`
        : "1 branch selected";
    }

    return `${formData.branch_ids.length} branches selected`;
  };

  const getWarehouseLabel = () => {
    if (loadingAssignments) {
      return "Loading warehouses...";
    }

    if (
      formData.warehouse_ids.length === 0
    ) {
      return "Select warehouses";
    }

    if (
      formData.warehouse_ids.length === 1
    ) {
      const warehouse = warehouses.find(
        (item) =>
          String(item.id) ===
          formData.warehouse_ids[0]
      );

      return warehouse
        ? `${warehouse.name} (${warehouse.code})`
        : "1 warehouse selected";
    }

    return `${formData.warehouse_ids.length} warehouses selected`;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setFormError("");

    if (!formData.role) {
      setFormError(
        "Please select a user role."
      );

      return;
    }

    if (
      formData.password !==
      formData.password_confirmation
    ) {
      setFormError(
        "Passwords do not match."
      );

      return;
    }

    if (
      formData.role ===
        "branch_coordinator" &&
      formData.branch_ids.length === 0
    ) {
      setFormError(
        "Please assign at least one branch."
      );

      return;
    }

    if (
      formData.role ===
        "warehouse_coordinator" &&
      formData.warehouse_ids.length === 0
    ) {
      setFormError(
        "Please assign at least one warehouse."
      );

      return;
    }

    const branchIds =
      formData.branch_ids.map(Number);

    const warehouseIds =
      formData.warehouse_ids.map(Number);

    const response =
      await handleCreateUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation:
          formData.password_confirmation,
        role: formData.role,

        branch_id:
          formData.role ===
            "branch_coordinator"
            ? branchIds[0] ?? null
            : null,

        warehouse_id:
          formData.role ===
            "warehouse_coordinator"
            ? warehouseIds[0] ?? null
            : null,

        branch_ids:
          formData.role ===
            "branch_coordinator"
            ? branchIds
            : [],

        warehouse_ids:
          formData.role ===
            "warehouse_coordinator"
            ? warehouseIds
            : [],

        status: formData.status,
      });

    if (!response) {
      return;
    }

    setFormData(initialFormData);
    setFormError("");

    onOpenChange(false);
  };

  const handleOpenChange = (
    nextOpen: boolean
  ) => {
    if (!nextOpen) {
      setFormData(initialFormData);
      setFormError("");
      setAssignmentError("");
    }

    onOpenChange(nextOpen);
  };

  const displayError =
    formError ||
    error ||
    assignmentError;

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="border-blue-100 bg-white text-slate-900 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-slate-900">
            Add User
          </DialogTitle>

          <DialogDescription className="text-slate-500">
            Create a new system user and assign
            their role.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {displayError && (
            <div
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
              role="alert"
            >
              {displayError}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-slate-700"
              >
                Full Name
              </label>

              <Input
                id="name"
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    name: event.target.value,
                  })
                }
                required
                disabled={loading}
                className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-100"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email Address
              </label>

              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    email: event.target.value,
                  })
                }
                required
                disabled={loading}
                className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-100"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    password:
                      event.target.value,
                  })
                }
                required
                minLength={8}
                disabled={loading}
                className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-100"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password_confirmation"
                className="text-sm font-medium text-slate-700"
              >
                Confirm Password
              </label>

              <Input
                id="password_confirmation"
                type="password"
                placeholder="Confirm password"
                value={
                  formData.password_confirmation
                }
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    password_confirmation:
                      event.target.value,
                  })
                }
                required
                minLength={8}
                disabled={loading}
                className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Role
            </label>

            <Select
              value={formData.role}
              onValueChange={(value) =>
                handleRoleChange(
                  value as UserRole
                )
              }
              disabled={loading}
            >
              <SelectTrigger className="w-full border-slate-200 bg-white text-slate-900 focus:ring-blue-100">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="admin">
                  Admin
                </SelectItem>

                <SelectItem value="branch_coordinator">
                  Branch Coordinator
                </SelectItem>

                <SelectItem value="warehouse_coordinator">
                  Warehouse Coordinator
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.role ===
            "branch_coordinator" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Assign Branches
              </label>

              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      disabled={
                        loadingAssignments ||
                        loading
                      }
                      className="w-full justify-between border-slate-200 bg-white font-normal text-slate-900 hover:bg-slate-50"
                    />
                  }
                >
                  <span className="truncate">
                    {getBranchLabel()}
                  </span>
                
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  className="w-[var(--radix-popover-trigger-width)] min-w-80 p-2"
                >
                  <div className="max-h-64 overflow-y-auto">
                    {branches.length ===
                    0 ? (
                      <p className="px-3 py-2 text-sm text-slate-500">
                        No branches available.
                      </p>
                    ) : (
                      branches.map(
                        (branch) => {
                          const branchId =
                            String(
                              branch.id
                            );

                          const checked =
                            formData.branch_ids.includes(
                              branchId
                            );

                          return (
                            <label
                              key={
                                branch.id
                              }
                              className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm transition hover:bg-slate-50"
                            >
                              <Checkbox
                                checked={
                                  checked
                                }
                                onCheckedChange={() =>
                                  toggleBranch(
                                    branchId
                                  )
                                }
                              />

                              <div className="min-w-0">
                                <p className="truncate font-medium text-slate-700">
                                  {
                                    branch.name
                                  }
                                </p>

                                <p className="text-xs text-slate-400">
                                  {
                                    branch.code
                                  }
                                </p>
                              </div>

                              {checked && (
                                <Check className="ml-auto h-4 w-4 text-blue-600" />
                              )}
                            </label>
                          );
                        }
                      )
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              <p className="text-xs text-slate-400">
                Select all branches this coordinator
                is responsible for.
              </p>
            </div>
          )}

          {formData.role ===
            "warehouse_coordinator" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Assign Warehouses
              </label>

              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      disabled={
                        loadingAssignments ||
                        loading
                      }
                      className="w-full justify-between border-slate-200 bg-white font-normal text-slate-900 hover:bg-slate-50"
                    />
                  }
                >
                  <span className="truncate">
                    {getWarehouseLabel()}
                  </span>
                
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  className="w-[var(--radix-popover-trigger-width)] min-w-80 p-2"
                >
                  <div className="max-h-64 overflow-y-auto">
                    {warehouses.length ===
                    0 ? (
                      <p className="px-3 py-2 text-sm text-slate-500">
                        No warehouses available.
                      </p>
                    ) : (
                      warehouses.map(
                        (warehouse) => {
                          const warehouseId =
                            String(
                              warehouse.id
                            );

                          const checked =
                            formData.warehouse_ids.includes(
                              warehouseId
                            );

                          return (
                            <label
                              key={
                                warehouse.id
                              }
                              className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm transition hover:bg-slate-50"
                            >
                              <Checkbox
                                checked={
                                  checked
                                }
                                onCheckedChange={() =>
                                  toggleWarehouse(
                                    warehouseId
                                  )
                                }
                              />

                              <div className="min-w-0">
                                <p className="truncate font-medium text-slate-700">
                                  {
                                    warehouse.name
                                  }
                                </p>

                                <p className="text-xs text-slate-400">
                                  {
                                    warehouse.code
                                  }
                                </p>
                              </div>

                              {checked && (
                                <Check className="ml-auto h-4 w-4 text-blue-600" />
                              )}
                            </label>
                          );
                        }
                      )
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              <p className="text-xs text-slate-400">
                Select all warehouses this coordinator
                is responsible for.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Status
            </label>

            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  status:
                    value as UserStatus,
                })
              }
              disabled={loading}
            >
              <SelectTrigger className="w-full border-slate-200 bg-white text-slate-900 focus:ring-blue-100">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="active">
                  Active
                </SelectItem>

                <SelectItem value="inactive">
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="border-t border-blue-100 bg-blue-50/60 pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                handleOpenChange(false)
              }
              disabled={loading}
              className="border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading
                ? "Creating..."
                : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}