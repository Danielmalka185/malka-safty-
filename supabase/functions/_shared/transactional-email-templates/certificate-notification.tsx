import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "מלכא בטיחות"

interface CertificateNotificationProps {
  employeeName?: string
  companyName?: string
  trainingType?: string
  date?: string
}

const CertificateNotificationEmail = ({
  employeeName,
  companyName,
  trainingType,
  date,
}: CertificateNotificationProps) => (
  <Html lang="he" dir="rtl">
    <Head />
    <Preview>תעודת הדרכה - {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {employeeName ? `שלום ${employeeName},` : 'שלום,'}
        </Heading>
        <Text style={text}>
          תעודת ההדרכה שלך{trainingType ? ` בנושא "${trainingType}"` : ''} מוכנה.
        </Text>
        {companyName && (
          <Text style={text}>חברה: {companyName}</Text>
        )}
        {date && (
          <Text style={text}>תאריך: {date}</Text>
        )}
        <Text style={footer}>בברכה, צוות {SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: CertificateNotificationEmail,
  subject: (data: Record<string, any>) =>
    data?.trainingType
      ? `תעודת הדרכה: ${data.trainingType} — ${SITE_NAME}`
      : `תעודת הדרכה — ${SITE_NAME}`,
  displayName: 'התראת תעודה',
  previewData: {
    employeeName: 'ישראל ישראלי',
    companyName: 'חברה לדוגמה',
    trainingType: 'בטיחות אש',
    date: '2026-03-29',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Rubik, Arial, sans-serif' }
const container = { padding: '20px 25px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1e3a5f', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.5', margin: '0 0 15px' }
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
