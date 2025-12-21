import React from 'react'
import { Card } from '@/components/ui/card'
export default function UserMessage({content}: {content: string}) {
  return (
    <div className='flex justify-end pb-4'>
      <Card className='rouned-lg bg-muted p-3 shadow-none border-none max-w-[80%] break-words'>
        {content}
      </Card>
    </div>
  )
}
