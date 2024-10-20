"use client";

import { StateForStatus, updateInvoiceStatus } from "@/app/lib/actions";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { CheckIcon, ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useActionState } from "react";

const statuses = ["pending", "paid", "canceled", "overdue"];

export default function InvoiceStatus({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const initialState: StateForStatus = { message: null, errors: {} };
  const updateInvoiceStatusWithId = updateInvoiceStatus.bind(null, id);
  const [state, formAction] = useActionState(
    updateInvoiceStatusWithId,
    initialState
  );

  return (
    <Menu>
      <MenuButton>
        <span
          className={clsx(
            "inline-flex items-center rounded-full px-2 py-1 text-xs",
            {
              "bg-gray-100 text-gray-500": status === "pending",
              "bg-orange-500 text-white": status === "overdue",
              "bg-green-500 text-white": status === "paid",
              "bg-red-500 text-white": status === "canceled",
            }
          )}
        >
          {status === "pending" ? (
            <>
              Pending
              <ClockIcon className="ml-1 w-4 text-gray-500" />
            </>
          ) : null}
          {status === "overdue" ? (
            <>
              Overdue
              <ClockIcon className="ml-1 w-4 text-white" />
            </>
          ) : null}
          {status === "paid" ? (
            <>
              Paid
              <CheckIcon className="ml-1 w-4 text-white" />
            </>
          ) : null}
          {status === "canceled" ? (
            <>
              Canceled
              <XMarkIcon className="ml-1 w-4 text-white" />
            </>
          ) : null}
        </span>
      </MenuButton>

      <MenuItems
        anchor="bottom"
        transition
        className="absolute right-0 z-10 mt-2 w-min origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        {statuses.map(
          (newStatus) =>
            newStatus !== status && (
              <form key={newStatus} action={formAction}>
                <MenuItem>
                  {({ close }) => (
                    <>
                      <input hidden name="status" value={newStatus} />
                      <button
                        onClick={close}
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                      >
                        {newStatus}
                      </button>
                    </>
                  )}
                </MenuItem>
              </form>
            )
        )}
      </MenuItems>
    </Menu>
  );
}
