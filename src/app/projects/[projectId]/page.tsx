import React from 'react'

export default async function ProjectPage({props}: {props: Promise<{projectId: string}>}) {
  const {projectId} = await props

  return (
    <div>
      projectId: {projectId}
    </div>
  )
}
