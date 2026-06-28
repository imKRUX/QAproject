import { getWorkshops, getBookingsByWorkshopId, getBookingsByEmail } from '@/lib/db'
import { auth } from '@/auth'
import { WorkshopForm } from '@/components/WorkshopForm'
import { ManageWorkshops } from '@/components/ManageWorkshops'
import { MyBookings } from '@/components/MyBookings'
import { redirect } from 'next/navigation'

export default async function WorkspacePage() {
     const session = await auth()
     if (!session?.user) redirect('/login')

     const sessionEmail = session.user.email!
     const sessionName = session.user.name ?? 'You'
     const sessionImage = session.user.image ?? null

     const initials = sessionName
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()

     const workshops = getWorkshops()
     const myWorkshops = workshops.filter(w => w.hostEmail === sessionEmail)
     const enrolleesById = Object.fromEntries(
          myWorkshops.map(w => [w.id, getBookingsByWorkshopId(w.id)])
     )

     const bookedWorkshops = getBookingsByEmail(sessionEmail)
          .map(b => workshops.find(w => w.id === b.workshopId))
          .filter((w): w is NonNullable<typeof w> => Boolean(w))

     return (
          <main className="flex-1">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    <div className="mb-2">
                         <p
                              className="text-xs font-semibold tracking-widest uppercase mb-2"
                              style={{ color: '#ea580c' }}
                         >
                              Learn, Teach &amp; Grow Together
                         </p>
                         <h1 className="text-2xl sm:text-4xl font-bold text-stone-900">
                              {sessionName}&apos;s Studio Workspace
                         </h1>
                    </div>

                    <hr className="border-stone-200 my-6" />

                    <div className="flex flex-col lg:flex-row gap-8">
                         <div className="flex-1 min-w-0 space-y-6">
                              {/* Profile Card */}
                              <div className="bg-white border border-stone-200 rounded-xl p-5">
                                   <div className="flex items-start gap-4">
                                        <div
                                             className="w-16 h-16 rounded-lg overflow-hidden shrink-0 flex items-center justify-center text-white text-xl font-bold"
                                             style={{ backgroundColor: '#ea580c' }}
                                        >
                                             {sessionImage ? (
                                                  <img src={sessionImage} alt={sessionName} className="w-full h-full object-cover" />
                                             ) : (
                                                  initials
                                             )}
                                        </div>
                                        <div className="flex-1">
                                             <div className="flex items-start justify-between">
                                                  <div>
                                                       <h2 className="text-xl font-bold text-stone-900">{sessionName}</h2>
                                                       <div className="text-sm text-stone-500">{sessionEmail}</div>
                                                       <p className="text-xs text-stone-400 mt-0.5">
                                                            Manage your profile bio, verified skills, and experience history.
                                                       </p>
                                                  </div>
                                                  <button className="text-xs font-semibold text-stone-600 border border-stone-300 px-3 py-1.5 rounded hover:bg-stone-50 transition-colors uppercase tracking-wide">
                                                       Edit Profile
                                                  </button>
                                             </div>
                                        </div>
                                   </div>
                              </div>

                              {/* Host Workshop Portal */}
                              <div className="bg-white border border-stone-200 rounded-xl p-5">
                                   <div className="mb-5">
                                        <div
                                             className="text-xs font-bold uppercase tracking-widest mb-1"
                                             style={{ color: '#ea580c' }}
                                        >
                                             Host Workshop Portal
                                        </div>
                                        <h2 className="text-2xl font-bold text-stone-900 mb-1">
                                             Schedule a local neighborhood class
                                        </h2>
                                        <p className="text-sm text-stone-500">
                                             Teaching is free and cooperative! Schedule a session below, set your available
                                             seats, list what students should prepare, and save.
                                        </p>
                                   </div>
                                   <WorkshopForm hostEmail={sessionEmail} />
                              </div>

                              {/* Manage Your Workshops */}
                              <div className="bg-white border border-stone-200 rounded-xl p-5">
                                   <div className="mb-5">
                                        <div
                                             className="text-xs font-bold uppercase tracking-widest mb-1"
                                             style={{ color: '#ea580c' }}
                                        >
                                             Manage Your Workshops
                                        </div>
                                        <h2 className="text-2xl font-bold text-stone-900 mb-1">
                                             Edit sessions
                                        </h2>
                                        <p className="text-sm text-stone-500">
                                             Update details of your hosted classes and track enrolled members.
                                        </p>
                                   </div>

                                   <ManageWorkshops workshops={myWorkshops} enrolleesById={enrolleesById} />
                              </div>
                         </div>

                         <MyBookings workshops={bookedWorkshops} />
                    </div>
               </div>
          </main>
     )
}
