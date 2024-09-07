import Bottombar from '@/components/shared/Bottombar'
import LeftSidebar from '@/components/shared/LeftSidebar'
import Topbar from '@/components/shared/Topbar'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className='w-full md:flex'>
      <ResizablePanelGroup direction='horizontal'>
        <Topbar />
        <ResizablePanel defaultSize={20}>
          <LeftSidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="flex h-full flex-1">
          <Outlet />
        </ResizablePanel>
        <Bottombar />
      </ResizablePanelGroup>
    </div>
  )
}

export default RootLayout
