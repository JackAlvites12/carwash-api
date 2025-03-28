import { Body, Column, Container, Head, Heading, Hr, Html, Img, Row, Section, Text } from "@react-email/components"
import React from "react"
import { container, details__description, details__header, details__price, details__product, details_buy, details_ct, divisor, footer, footer__title, main, message, text1, text2, title_email, total_amount, transaction, transaction__id, transaction_title } from "../../css/styles"
import { CustomerInterface } from "../../interfaces/customer.interface"
import { CatalogInterface } from "../../interfaces/catalog.interface"

interface Props {
  customer: CustomerInterface,
  service: ServiceShort,
  catalog: CatalogInterface
}

interface ServiceShort {
    ticket: string,
    amount: number
}


export const EmailTemplate = ( propsToEmail: Props ) => {

    const { customer, service, catalog } = propsToEmail

    return (
        <Html>
          <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin=""
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
              rel="stylesheet"
            />
          </Head>
    
          <Body style={main}>
            <Container style={container}>
              <Section style={{ background: '#000' }}>
                <Img
                  style={{ padding: '0px', margin: 'auto' }}
                  src="https://static.vecteezy.com/system/resources/thumbnails/007/438/053/small/car-logo-automotive-logo-automobile-logo-car-logo-vehicle-logo-car-wash-logo-car-detailing-logo-car-service-logo-car-care-logo-design-vector.jpg"
                  
                  height="200"
                  alt="Logo Carwash"
                />
              </Section>
    
              <Heading style={title_email} as="h2">
                GRACIAS POR TU CONFIANZA!
              </Heading>
    
              <Section style={message}>
                <Text style={text1}>
                  ¡Gracias por confiar en nosotros para el cuidado de tu vehículo estimado { customer.fullname }!
                  🚗✨ Estamos felices de haberlo atendido y esperamos verlo pronto.
                  ¡Que tenga un excelente día!
                </Text>
              </Section>
    
              <Hr style={divisor} />
    
              <Section style={details_ct}>
                <Heading as="h3">Detalle del servicio</Heading>
    
                <Hr style={divisor} />
    
                <Section style={transaction}>
                  <Text style={transaction_title}>Nro de Ticket:</Text>
                  <Text style={transaction__id}>{ service.ticket }</Text>
                </Section>
    
                <Section>
                  <Row style={details__header}>
                    <Column>Servicio</Column>
                    <Column>Descripción</Column>
                    <Column>Precio</Column>
                  </Row>
    
                  <Hr style={divisor} />
    
                  <Row style={details_buy}>
                    <Column style={details__product}>{ catalog.service }</Column>
                    <Column style={details__description}>
                      { catalog.description }
                    </Column>
                    <Column style={details__price}>S/.{ catalog.price }</Column>
                  </Row>
                </Section>
    
                <Hr style={divisor} />
    
                <Text style={total_amount}>Total: S/.{ service.amount }</Text>
    
                <Section style={footer}>
                  <Text style={footer__title}>
                    © Carwash "El kraken" - Todos los derechos reservados
                  </Text>
                </Section>
              </Section>
            </Container>
          </Body>
        </Html>
      );

}
