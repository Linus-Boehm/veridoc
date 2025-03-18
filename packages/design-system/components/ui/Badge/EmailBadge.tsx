import { BaseEntityBadgeProps, EntityBadge } from "./EntityBadge"

import { MailIcon } from "lucide-react"

interface EmailBadgeProps extends BaseEntityBadgeProps {
    emailSubject: string
    emailId: string

}

export const EmailBadge = ({ emailId, emailSubject, ...props }: EmailBadgeProps) => {
    const emailPath = `/inbox/${emailId}`;
    return (
        <EntityBadge icon={<MailIcon className="h-4 w-4 text-lime-600" />} href={emailPath} title="Email Öffnen" {...props}>
            {emailSubject}
        </EntityBadge>
    )
}