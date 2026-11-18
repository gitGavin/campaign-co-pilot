'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  UserCircle,
  Check,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'

interface Segment {
  id: string
  name: string
  memberCount: number
  avgOrderValue: number
  purchasesPerYear: number
  predictedResponse: 'High' | 'Medium' | 'Low'
  reasoning: string
  type: 'recommended' | 'optional'
  selected: boolean
  demographics: {
    ageRange: string
    topLocations: string[]
    genderSplit: { male: number; female: number; other: number }
  }
  behavioral: {
    topCategories: string[]
    avgSessionDuration: string
    lastPurchase: string
  }
  channels: {
    email: number
    sms: number
    push: number
    social: number
  }
  insights: string[]
}

interface AudienceSegmentCardsProps {
  onConfirm?: () => void
}

export function AudienceSegmentCards({ onConfirm }: AudienceSegmentCardsProps = {}) {
  const [segments, setSegments] = useState<Segment[]>([
    {
      id: '1',
      name: 'VIP Loyalists',
      memberCount: 42000,
      avgOrderValue: 180,
      purchasesPerYear: 8.2,
      predictedResponse: 'High',
      reasoning: 'Your highest-value members. They respond strongly to exclusivity messaging and premium offers. Historical data shows 3.2x higher engagement than average members on VIP-focused campaigns.',
      type: 'recommended',
      selected: false,
      demographics: {
        ageRange: '35-54',
        topLocations: ['New York', 'Los Angeles', 'Chicago'],
        genderSplit: { male: 45, female: 52, other: 3 }
      },
      behavioral: {
        topCategories: ['Premium Products', 'Limited Editions', 'Early Access'],
        avgSessionDuration: '12m 34s',
        lastPurchase: 'Within 30 days'
      },
      channels: {
        email: 45,
        sms: 28,
        push: 18,
        social: 9
      },
      insights: [
        'Peak engagement time: Weekday evenings (6-9 PM)',
        'Highly responsive to scarcity messaging (limited time/quantity)',
        'Strong preference for personalized recommendations',
        '92% open rate on VIP-exclusive offers'
      ]
    },
    {
      id: '2',
      name: 'Re-engagement Potentials',
      memberCount: 28000,
      avgOrderValue: 95,
      purchasesPerYear: 2.1,
      predictedResponse: 'Medium',
      reasoning: 'Previously active members who have decreased engagement in the past 90 days. Win-back campaigns targeting this group have shown 28% reactivation rate with personalized incentives.',
      type: 'recommended',
      selected: false,
      demographics: {
        ageRange: '25-44',
        topLocations: ['San Francisco', 'Austin', 'Seattle'],
        genderSplit: { male: 48, female: 49, other: 3 }
      },
      behavioral: {
        topCategories: ['Seasonal Items', 'Sale Products', 'Core Collection'],
        avgSessionDuration: '6m 18s',
        lastPurchase: '60-120 days ago'
      },
      channels: {
        email: 52,
        sms: 22,
        push: 15,
        social: 11
      },
      insights: [
        'Most likely to respond to discount incentives (15-20% off)',
        'Strong performance with "We miss you" messaging',
        'Higher conversion when highlighting new products',
        'Best response to campaigns sent Tuesday-Thursday mornings'
      ]
    },
    {
      id: '3',
      name: 'Budget-Conscious Shoppers',
      memberCount: 18500,
      avgOrderValue: 55,
      purchasesPerYear: 4.5,
      predictedResponse: 'Medium',
      reasoning: 'Price-sensitive segment that responds well to sales and value propositions. While lower AOV, they maintain consistent purchase frequency and could be nurtured into higher tiers.',
      type: 'optional',
      selected: false,
      demographics: {
        ageRange: '22-35',
        topLocations: ['Houston', 'Phoenix', 'Philadelphia'],
        genderSplit: { male: 51, female: 46, other: 3 }
      },
      behavioral: {
        topCategories: ['Sale Items', 'Value Packs', 'Basics'],
        avgSessionDuration: '8m 42s',
        lastPurchase: 'Within 45 days'
      },
      channels: {
        email: 38,
        sms: 35,
        push: 20,
        social: 7
      },
      insights: [
        'Highest engagement on sale announcement emails',
        'Strong mobile shopping preference (78% mobile conversions)',
        'Responds well to bundle offers and multi-buy promotions',
        'Lower engagement outside of promotional periods'
      ]
    }
  ])

  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const toggleSegmentSelection = (id: string) => {
    setSegments(prev =>
      prev.map(seg =>
        seg.id === id ? { ...seg, selected: !seg.selected } : seg
      )
    )
  }

  const toggleCardExpanded = (id: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const selectedSegment = segments.find(s => s.id === selectedSegmentId)
  const totalSelected = segments.filter(s => s.selected).reduce((sum, s) => sum + s.memberCount, 0)
  const estimatedReach = Math.floor(totalSelected * 0.93) // 93% deliverability

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <Users className="h-4 w-4 text-accent" />
          </div>
          <span className="font-medium text-accent">Audience Agent</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">
          I've analyzed your loyalty program data and identified 3 segments aligned with your strategy:
        </p>
      </div>

      {/* Segment Cards */}
      <div className="space-y-4">
        {segments.map((segment) => {
          const isExpanded = expandedCards.has(segment.id)
          const isRecommended = segment.type === 'recommended'
          const isOptional = segment.type === 'optional'
          
          return (
            <Card
              key={segment.id}
              className={`p-5 transition-all cursor-pointer ${
                segment.selected
                  ? 'bg-primary/5 border-primary shadow-sm'
                  : isOptional
                  ? 'border-dashed border-muted-foreground/30 bg-muted/30'
                  : 'bg-card hover:shadow-md hover:border-primary/30'
              } ${
                isRecommended && !segment.selected ? 'border-l-4 border-l-primary' : ''
              }`}
              onClick={() => toggleCardExpanded(segment.id)}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {segment.name}
                    </h3>
                    {segment.selected && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </div>
                {isRecommended && !segment.selected && (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    Recommended
                  </Badge>
                )}
                {isOptional && (
                  <Badge variant="outline" className="border-muted-foreground/50 text-muted-foreground">
                    Optional
                  </Badge>
                )}
              </div>

              {/* Metrics */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserCircle className="h-4 w-4" />
                  <span className="font-medium text-foreground">
                    {segment.memberCount.toLocaleString()} members
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      <span className="font-medium text-foreground">${segment.avgOrderValue}</span> avg order value
                    </span>
                  </div>
                  <span className="text-muted-foreground">|</span>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>
                      <span className="font-medium text-foreground">{segment.purchasesPerYear}</span> purchases/year
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Predicted response:</span>
                  <Badge
                    variant="secondary"
                    className={
                      segment.predictedResponse === 'High'
                        ? 'bg-green-500/10 text-green-700 border-green-500/20'
                        : segment.predictedResponse === 'Medium'
                        ? 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                        : 'bg-red-500/10 text-red-700 border-red-500/20'
                    }
                  >
                    {segment.predictedResponse}
                  </Badge>
                </div>
              </div>

              {/* Reasoning */}
              <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Why this segment:
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {isExpanded ? segment.reasoning : `${segment.reasoning.slice(0, 120)}...`}
                </p>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="space-y-4 mb-4 pt-4 border-t border-border">
                  {/* Demographics */}
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-2">Demographics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Age Range:</span>
                        <span className="font-medium text-foreground">{segment.demographics.ageRange}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Top Locations:</span>
                        <span className="font-medium text-foreground">{segment.demographics.topLocations.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Behavioral Data */}
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-2">Behavioral Data</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Top Categories:</span>
                        <span className="font-medium text-foreground text-right">{segment.behavioral.topCategories.slice(0, 2).join(', ')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Avg Session:</span>
                        <span className="font-medium text-foreground">{segment.behavioral.avgSessionDuration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Purchase:</span>
                        <span className="font-medium text-foreground">{segment.behavioral.lastPurchase}</span>
                      </div>
                    </div>
                  </div>

                  {/* Channel Preferences */}
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-3">Channel Preferences</h4>
                    <div className="space-y-2">
                      {Object.entries(segment.channels).map(([channel, percentage]) => (
                        <div key={channel} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground capitalize">{channel}</span>
                            <span className="font-medium text-foreground">{percentage}%</span>
                          </div>
                          <Progress value={percentage} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Insights */}
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-2">Campaign-Relevant Insights</h4>
                    <ul className="space-y-1.5">
                      {segment.insights.map((insight, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-primary">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleCardExpanded(segment.id)}
                  className="text-xs"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Hide details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Show details
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  onClick={() => toggleSegmentSelection(segment.id)}
                  className={segment.selected ? 'bg-primary' : ''}
                >
                  {segment.selected ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Added
                    </>
                  ) : (
                    <>Add</>
                  )}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Bottom Summary */}
      {totalSelected > 0 && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total selected:</span>
              <span className="font-semibold text-foreground">
                {totalSelected.toLocaleString()} members
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated reach:</span>
              <span className="font-semibold text-primary">
                {estimatedReach.toLocaleString()} (after deliverability)
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button 
          className="font-medium"
          disabled={totalSelected === 0}
          onClick={onConfirm}
        >
          Confirm segments
        </Button>
        <Button variant="outline">
          Create custom segment
        </Button>
        <Button variant="outline">
          Adjust criteria
        </Button>
      </div>
    </div>
  )
}
