import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type SkillBadge } from '../../backend';
import { formatTimestamp } from '../../utils/format';
import { CheckCircle2 } from 'lucide-react';

interface BadgeCardProps {
  badge: SkillBadge;
}

export default function BadgeCard({ badge }: BadgeCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group"
      onClick={() => navigate({ to: '/badge/$badgeId', params: { badgeId: badge.id.toString() } })}
    >
      <CardHeader className="space-y-3">
        {/* Badge Visual */}
        <div
          className="relative h-40 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
          style={{
            backgroundImage: 'url(/assets/generated/badge-card-bg.dim_1600x900.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <img
            src="/assets/generated/badge-icons-set.dim_1024x1024.png"
            alt={badge.skillName}
            className="h-24 w-24 object-contain drop-shadow-lg group-hover:scale-110 transition-transform"
          />
          {badge.verified && (
            <div className="absolute top-2 right-2">
              <Badge variant="default" className="gap-1 bg-primary/90">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </Badge>
            </div>
          )}
        </div>

        {/* Badge Info */}
        <div className="space-y-1">
          <CardTitle className="text-xl">{badge.skillName}</CardTitle>
          {badge.level && (
            <Badge variant="secondary" className="text-xs">
              {badge.level}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {badge.description || 'Skill badge earned through verified learning'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          Issued {formatTimestamp(badge.issueTimestamp)}
        </p>
      </CardContent>
    </Card>
  );
}

