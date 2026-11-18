'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Check,
  Rocket,
  Download,
  Share2,
  Edit3,
  Save,
  Target,
  Users,
  DollarSign,
  Calendar,
  AlertTriangle,
  Sparkles,
  TrendingUp
} from 'lucide-react'

interface CampaignReviewProps {
  onLaunch?: () => void
  onExport?: () => void
  onShare?: () => void
  onEdit?: () => void
  onSaveDraft?: () => void
}

export function CampaignReview({
  onLaunch,
  onExport,
  onShare,
  onEdit,
  onSaveDraft
}: CampaignReviewProps = {}) {
  const [showLaunchModal, setShowLaunchModal] = useState(false)

  const handleLaunchClick = () => {
    setShowLaunchModal(true)
  }

  const handleConfirmLaunch = () => {
    setShowLaunchModal(false)
    if (onLaunch) {
      onLaunch()
    }
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-2 py-6">
        <h2 className="font-serif text-3xl font-semibold text-foreground flex items-center justify-center gap-3">
          <span className="text-4xl">🎉</span>
          Your campaign is ready!
        </h2>
        <p className="text-lg text-muted-foreground">
          Here&apos;s your complete Holiday Loyalty campaign plan.
        </p>
      </div>

      {/* Campaign Summary Card */}
      <Card className="p-6 border-2">
        <div className="space-y-6">
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Campaign Summary
            </div>
            <h3 className="font-serif text-2xl font-semibold text-foreground">
              Holiday Loyalty - Tiered Exclusivity
            </h3>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground uppercase">Goal</span>
              </div>
              <div className="text-2xl font-bold text-foreground">+20%</div>
              <div className="text-xs text-muted-foreground">Revenue</div>
            </Card>

            <Card className="p-4 bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground uppercase">Audience</span>
              </div>
              <div className="text-2xl font-bold text-foreground">70K</div>
              <div className="text-xs text-muted-foreground">members</div>
            </Card>

            <Card className="p-4 bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground uppercase">Budget</span>
              </div>
              <div className="text-2xl font-bold text-foreground">$500K</div>
              <div className="text-xs text-muted-foreground">Total spend</div>
            </Card>

            <Card className="p-4 bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground uppercase">Timeline</span>
              </div>
              <div className="text-2xl font-bold text-foreground">Nov 15 -</div>
              <div className="text-2xl font-bold text-foreground">Dec 24</div>
            </Card>
          </div>

          {/* Channel Breakdown */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Channel Breakdown</h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Email</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">4 sends</span>
                    <span className="text-sm font-semibold text-foreground">45%</span>
                  </div>
                </div>
                <Progress value={45} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Paid Social</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">6 weeks</span>
                    <span className="text-sm font-semibold text-foreground">30%</span>
                  </div>
                </div>
                <Progress value={30} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">SMS</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">2 sends</span>
                    <span className="text-sm font-semibold text-foreground">20%</span>
                  </div>
                </div>
                <Progress value={20} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Push</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">2 sends</span>
                    <span className="text-sm font-semibold text-foreground">5%</span>
                  </div>
                </div>
                <Progress value={5} className="h-2" />
              </div>
            </div>
          </div>

          {/* Predicted Outcomes */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">Predicted Outcomes</h4>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Revenue: </span>
                <span className="font-semibold text-foreground">$1.8M</span>
              </div>
              <div>
                <span className="text-muted-foreground">ROAS: </span>
                <span className="font-semibold text-foreground">3.6x</span>
              </div>
              <div>
                <span className="text-muted-foreground">Reach: </span>
                <span className="font-semibold text-foreground">65K</span>
              </div>
            </div>
          </Card>
        </div>
      </Card>

      {/* Deliverables Checklist */}
      <Card className="p-6">
        <h4 className="text-sm font-semibold text-foreground mb-4">Ready for Launch</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Check className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm text-foreground">Strategy defined: Tiered Exclusivity</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Check className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm text-foreground">Audiences configured: VIP Loyalists, Lapsed Loyalists</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Check className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm text-foreground">Channel mix allocated: 4 channels</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Check className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm text-foreground">Timeline scheduled: Nov 15 - Dec 24</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Check className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm text-foreground">Briefs generated: 3 channel briefs</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Check className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm text-foreground">Copy drafted: Email 1 ready, 3 more pending</span>
          </div>

          <div className="pt-3 mt-3 border-t border-border">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-medium text-foreground">Pending:</span>
                <span className="text-sm text-muted-foreground ml-1">
                  Creative assets, final stakeholder approval
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <Button 
            size="lg" 
            className="flex-1 min-w-[200px] gap-2 text-lg py-6"
            onClick={handleLaunchClick}
          >
            <Rocket className="h-5 w-5" />
            Launch Campaign
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            size="lg"
            className="flex-1 gap-2 bg-transparent"
            onClick={onExport}
          >
            <Download className="h-4 w-4" />
            Export Plan
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="flex-1 gap-2 bg-transparent"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
            Share Link
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button 
            variant="ghost" 
            size="lg"
            className="flex-1 gap-2"
            onClick={onEdit}
          >
            <Edit3 className="h-4 w-4" />
            Edit Campaign
          </Button>
          <Button 
            variant="ghost" 
            size="lg"
            className="flex-1 gap-2"
            onClick={onSaveDraft}
          >
            <Save className="h-4 w-4" />
            Save as Draft
          </Button>
        </div>
      </div>

      {/* Launch Confirmation Modal */}
      <Dialog open={showLaunchModal} onOpenChange={setShowLaunchModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Ready to launch?</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4 pt-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">This will:</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-foreground">•</span>
                      <span>Send campaign briefs to your connected platforms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-foreground">•</span>
                      <span>Schedule all activities per your timeline</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-foreground">•</span>
                      <span>Begin audience sync with ad platforms</span>
                    </li>
                  </ul>
                </div>

                <Card className="p-3 bg-primary/5 border-primary/20">
                  <p className="text-sm font-medium text-foreground">
                    First activity: Email Teaser sends Nov 15, 9:00 AM
                  </p>
                </Card>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowLaunchModal(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleConfirmLaunch} className="gap-2">
              <Rocket className="h-4 w-4" />
              Confirm Launch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
