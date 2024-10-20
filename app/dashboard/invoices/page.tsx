import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';
import { Metadata } from 'next';
import { Tab, TabGroup, TabList } from '@headlessui/react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Invoices',
};

const statuses = [
  { label: "All", value: "" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Overdue", value: "overdue" },
  { label: "Canceled", value: "canceled" },
];

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    status?: string;
    page?: string;
  };
  }) {
  const query = searchParams?.query || '';
  const status = searchParams?.status || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchInvoicesPages(query);

  const createStatusURL = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status === 'all') {
      params.delete("status")
    } else {
      params.set("status", status);
    }
    return `/dashboard/invoices?${params.toString()}`;
  };

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>

      {/* Selected tab is not reflected on the UI, styling just took me too much time so I abandoned this */}
      <div className="my-4">
        <TabGroup>
          <TabList className="flex gap-4">
            {statuses.map((tab) => (
              <Tab
                key={tab.value}
                className="bg-gray-200 rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-blue-300 data-[hover]:bg-blue-200 data-[selected]:data-[hover]:bg-blue-400 data-[focus]:outline-1 data-[focus]:outline-white"
              >
                <Link href={createStatusURL(tab.value)}>{tab.label}</Link>
              </Tab>
            ))}
          </TabList>
        </TabGroup>
      </div>

      <Suspense
        key={query + status + currentPage}
        fallback={<InvoicesTableSkeleton />}
      >
        <Table query={query} status={status} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
