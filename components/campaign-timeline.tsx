'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lightbulb, ZoomIn, ZoomOut, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Activity {
  id: string
  channel: 'email' | 'paid-social' | 'sms' | 'push'
  name: string
  startWeek: number
  duration: number
  date: string
  description: string
}

interface Phase {
  name: string
  startWeek: number
  endWeek: number
}

interface CampaignTimelineProps {
  onConfirm?: () => void
}

export function CampaignTimeline({ onConfirm }: CampaignTimelineProps = {}) {
  const [zoom, setZoom] = useState(0.85)
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  const [hoveredActivity, setHoveredActivity] = useState<string | null>(null)

  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6']
  const dateRange = 'Nov 15 - Dec 24'

  const phases: Phase[] = [
    { name: 'AWARENESS', startWeek: 0, endWeek: 2 },
    { name: 'ENGAGEMENT', startWeek: 2, endWeek: 4 },
    { name: 'CONVERSION', startWeek: 4, endWeek: 6 },
  ]

  const channels = [
    { id: 'email', name: 'Email', color: 'bg-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-50' },
    { id: 'paid-social', name: 'Paid Social', color: 'bg-purple-500', textColor: 'text-purple-700', bgLight: 'bg-purple-50' },
    { id: 'sms', name: 'SMS', color: 'bg-green-500', textColor: 'text-green-700', bgLight: 'bg-green-50' },
    { id: 'push', name: 'Push', color: 'bg-orange-500', textColor: 'text-orange-700', bgLight: 'bg-orange-50' },
  ]

  const activities: Activity[] = [
    { id: 'e1', channel: 'email', name: 'Teaser', startWeek: 0, duration: 0.5, date: 'Nov 15', description: 'Initial teaser campaign to build anticipation' },
    { id: 'e2', channel: 'email', name: 'Main Offer', startWeek: 1, duration: 1.5, date: 'Nov 22', description: 'Primary campaign launch with full offer details' },
    { id: 'e3', channel: 'email', name: 'Reminder', startWeek: 3.5, duration: 0.8, date: 'Dec 6', description: 'Mid-campaign reminder for engagement' },
    { id: 'e4', channel: 'email', name: 'Last Chance', startWeek: 5, duration: 0.8, date: 'Dec 15', description: 'Final urgency push before deadline' },
    
    { id: 'p1', channel: 'paid-social', name: 'Awareness + Retargeting', startWeek: 0, duration: 4, date: 'Nov 15-Dec 13', description: 'Front-loaded awareness campaign with retargeting pixels' },
    
    { id: 's1', channel: 'sms', name: 'Flash', startWeek: 4, duration: 0.5, date: 'Dec 8', description: 'High-urgency flash sale notification' },
    { id: 's2', channel: 'sms', name: 'Last Chance', startWeek: 5.3, duration: 0.4, date: 'Dec 20', description: 'Final SMS push with scarcity messaging' },
    
    { id: 'pu1', channel: 'push', name: 'Alert', startWeek: 4.2, duration: 0.3, date: 'Dec 10', description: 'Push notification for flash sale' },
    { id: 'pu2', channel: 'push', name: 'Final', startWeek: 5.5, duration: 0.4, date: 'Dec 22', description: 'Final push notifications - dual send' },
  ]

  const getChannelColor = (channelId: string) => {
    return channels.find(c => c.id === channelId) || channels[0]
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Campaign Timeline
          </h2>
          <p className="text-sm text-muted-foreground">{dateRange}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            className="h-8 w-8 bg-transparent"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom(Math.min(2, zoom + 0.25))}
            className="h-8 w-8 bg-transparent"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Timeline Visualization */}
      <Card className="p-6 overflow-x-auto overflow-y-visible">
        <div className="min-w-[800px]" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
          {/* Week Headers */}
          <div className="flex mb-4">
            <div className="w-32 flex-shrink-0" />
            <div className="flex-1 flex">
              {weeks.map((week, idx) => (
                <div key={week} className="flex-1 text-center">
                  <span className="text-xs font-medium text-muted-foreground">{week}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phase Indicators */}
          <div className="flex mb-2 relative" style={{ height: '24px' }}>
            <div className="w-32 flex-shrink-0" />
            <div className="flex-1 flex relative">
              {phases.map((phase) => (
                <div
                  key={phase.name}
                  className="absolute top-0 bottom-0 flex items-center justify-center"
                  style={{
                    left: `${(phase.startWeek / 6) * 100}%`,
                    width: `${((phase.endWeek - phase.startWeek) / 6) * 100}%`,
                  }}
                >
                  <span className="text-[10px] font-semibold text-muted-foreground tracking-wider">
                    {phase.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-1 overflow-visible">
            {/* Channel Rows */}
            {channels.map((channel) => (
              <div key={channel.id} className="flex items-center group overflow-visible">
                {/* Channel Label */}
                <div className="w-32 flex-shrink-0 pr-4">
                  <div className="flex items-center gap-2">
                    <div className={cn('h-3 w-3 rounded', channel.color)} />
                    <span className="text-sm font-medium text-foreground">{channel.name}</span>
                  </div>
                </div>

                {/* Timeline Grid */}
                <div className="flex-1 relative overflow-visible" style={{ height: '56px' }}>
                  {/* Background Grid */}
                  <div className="absolute inset-0 flex">
                    {weeks.map((_, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'flex-1 border-r border-border/30',
                          idx === weeks.length - 1 && 'border-r-0'
                        )}
                      />
                    ))}
                  </div>

                  {/* Phase Backgrounds */}
                  {phases.map((phase, idx) => (
                    <div
                      key={phase.name}
                      className={cn(
                        'absolute top-0 bottom-0',
                        idx % 2 === 0 ? 'bg-muted/20' : 'bg-background'
                      )}
                      style={{
                        left: `${(phase.startWeek / 6) * 100}%`,
                        width: `${((phase.endWeek - phase.startWeek) / 6) * 100}%`,
                      }}
                    />
                  ))}

                  {/* Activity Blocks */}
                  {activities
                    .filter(activity => activity.channel === channel.id)
                    .map((activity) => {
                      const isSelected = selectedActivity === activity.id
                      const isHovered = hoveredActivity === activity.id
                      const channelColor = getChannelColor(activity.channel)

                      return (
                        <div
                          key={activity.id}
                          className={cn(
                            'absolute top-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center px-3 group/activity',
                            channelColor.color,
                            'hover:shadow-lg hover:scale-105',
                            isSelected && 'ring-2 ring-foreground shadow-xl scale-105',
                            isHovered && 'shadow-md'
                          )}
                          style={{
                            left: `${(activity.startWeek / 6) * 100}%`,
                            width: `${(activity.duration / 6) * 100}%`,
                            height: '40px',
                            minWidth: '60px',
                          }}
                          onClick={() => setSelectedActivity(activity.id)}
                          onMouseEnter={() => setHoveredActivity(activity.id)}
                          onMouseLeave={() => setHoveredActivity(null)}
                        >
                          <GripVertical className="h-3 w-3 text-white/50 mr-1 opacity-0 group-hover/activity:opacity-100 transition-opacity" />
                          <span className="text-xs font-medium text-white truncate">
                            {activity.name}
                          </span>
                          
                          {/* Tooltip */}
                          {isHovered && (
                            <div
                              className="absolute w-64 pointer-events-none z-[100]"
                              style={{
                                bottom: '100%',
                                left: '0',
                                marginBottom: '8px',
                              }}
                            >
                              <Card className="p-3 shadow-xl border-2 bg-card pointer-events-auto">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-sm text-foreground">
                                      {activity.name}
                                    </span>
                                    <Badge variant="secondary" className="text-xs">
                                      {activity.date}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground leading-relaxed">
                                    {activity.description}
                                  </p>
                                  <div className={cn('text-xs font-medium', channelColor.textColor)}>
                                    {channel.name}
                                  </div>
                                </div>
                              </Card>
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* AI Insight */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex gap-3">
          <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm text-foreground leading-relaxed">
              <span className="font-medium">AI Insight:</span> Paid social front-loaded to avoid December CPM spike. SMS reserved for high-urgency moments.
            </p>
            <p className="text-xs text-muted-foreground">
              This timing optimizes for both cost efficiency and conversion impact based on historical data.
            </p>
          </div>
        </div>
      </Card>

      {/* Confirm Button */}
      {onConfirm && (
        <Button onClick={onConfirm} size="lg" className="w-full">
          Approve timeline
        </Button>
      )}

      {/* Selected Activity Details */}
      {selectedActivity && (
        <Card className="p-4 border-2 border-primary">
          {(() => {
            const activity = activities.find(a => a.id === selectedActivity)
            if (!activity) return null
            const channelColor = getChannelColor(activity.channel)
            const channel = channels.find(c => c.id === activity.channel)

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Activity Details</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedActivity(null)}
                    className="h-7 text-xs"
                  >
                    Close
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Name</label>
                    <p className="text-sm font-medium text-foreground">{activity.name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Channel</label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={cn('h-2 w-2 rounded', channelColor.color)} />
                      <p className="text-sm font-medium text-foreground">{channel?.name}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Date</label>
                    <p className="text-sm font-medium text-foreground">{activity.date}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Duration</label>
                    <p className="text-sm font-medium text-foreground">
                      {activity.duration} {activity.duration === 1 ? 'week' : 'weeks'}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Description</label>
                  <p className="text-sm text-foreground leading-relaxed mt-1">{activity.description}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    Edit Activity
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Reschedule
                  </Button>
                </div>
              </div>
            )
          })()}
        </Card>
      )}
    </div>
  )
}
