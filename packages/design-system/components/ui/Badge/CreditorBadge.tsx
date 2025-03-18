import { BaseEntityBadgeProps, EntityBadge } from "./EntityBadge"

import { Building2Icon } from "lucide-react"

interface CreditorBadgeProps extends BaseEntityBadgeProps {
    creditorId: string
    creditorName: string
    creditorNumber?: string

}

export const CreditorBadge = ({ creditorId, creditorName, creditorNumber, ...props }: CreditorBadgeProps) => {
    const creditorPath = `/companies/${creditorId}`;
    return (
        <EntityBadge icon={<Building2Icon className="h-4 w-4 text-purple-600 " />} href={creditorPath} title="Kreditor Öffnen" {...props}>
            {creditorNumber ? `${creditorNumber} - ${creditorName}` : creditorName}
        </EntityBadge>
    )
}