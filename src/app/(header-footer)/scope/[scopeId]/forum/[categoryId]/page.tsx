'use client';

import { queryService } from '@/api';
import { DataFilter, DataGrid, Tags } from '@/components';
import { useCurrentScope } from '@/hooks';
import { Plus } from '@phosphor-icons/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { GridOptions, ICellRendererParams } from 'ag-grid-community';
import Link from 'next/link';
import Community from '../../assets/Community.svg';

type Topic = Schema<'TopicResponseDTO'>;
type Options = GridOptions<Topic>;

const colDefs: Options['columnDefs'] = [
  {
    headerName: 'تاپیک',
    cellClass: 'p-4',
    flex: 1,
    cellRenderer: (props: ICellRendererParams<Topic>) => {
      const topic = props.data!;
      return (
        <Link href={`topic/${topic.id}`}>
          <p className="text-base">{topic.title}</p>
          <p className="text-sm text-opacity-50 whitespace-pre-wrap line-clamp-4 h-20 mt-2">{topic.content}</p>
          <Tags tags={topic.tags!} />
        </Link>
      );
    },
  },
  { maxWidth: 80, headerName: 'پاسخ‌ها', field: 'title', valueFormatter: () => (Math.random() * 100).toFixed() },
  {
    maxWidth: 200,
    headerName: 'آخرین تاریخ فعالیت',
    // field: 'title',
    // cellDataType: 'string',
    valueFormatter: () => new Date(Date.now() - Math.random() * 1000_000_000).toLocaleString(),
  },
];

const schema = {
  type: 'object',
  properties: {
    x: { type: 'string' },
    y: { type: 'string' },
  },
} as const;

export default function Forum({ params }: PageProps<'scopeId' | 'categoryId'>) {
  const scope = useCurrentScope();
  const topics = useSuspenseQuery(
    queryService('forum:/v1/scope/{scopeId}/topics', {
      params: { path: { scopeId: +params.scopeId }, query: {} },
    }),
  ).data.content;

  return (
    <>
      <div className="flex gap-20 items-center bg-nغثeutral-300">
        <Community />
        <div className="flex flex-col gap-6">
          <p>
            به فروم {params.categoryId} حوزه {scope.title} خوش آمدید
          </p>
          <p>در اینجا شما می‌توانید سوالات و دانش خود را با دیگران به اشتراک بگذارید</p>
        </div>
      </div>
      <div className="flex justify-between mb-2">
        <DataFilter schema={schema} />
        <Link href={{ pathname: 'topic/new', query: { categoryId: params.categoryId } }} className="btn btn-primary">
          <Plus />
          سوال جدید
        </Link>
      </div>
      <DataGrid rowHeight={180} suppressMovableColumns rowData={topics} columnDefs={colDefs} />
    </>
  );
}
