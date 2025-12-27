import ProjectView from '@/components/project-view'
import React from 'react'
type Props = {
  params: Promise<{ projectId: string }>
}
const Page = async({ params }: Props) => {
    const {projectId} = await params
  return (
    <ProjectView projectId={projectId} />
  )
}

export default Page