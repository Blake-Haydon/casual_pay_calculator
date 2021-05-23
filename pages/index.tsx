import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Container from 'react-bootstrap/Container'

export default function Home() {
  // Rates of pay state variables
  const [ordinaryRate, setOrdinaryRate] = useState(0);
  const [saturdayRate, setSaturdayRate] = useState(0);
  const [sundayRate, setSundayRate] = useState(0);
  const [publicHolidayRate, setPublicHolidayRate] = useState(0);

  // Number of hours worked state variables
  const [ordinaryHours, setOrdinaryHours] = useState(0);
  const [saturdayHours, setSaturdayHours] = useState(0);
  const [sundayHours, setSundayHours] = useState(0);
  const [publicHolidayHours, setPublicHolidayHours] = useState(0);

  // State variable to store the total pay
  const [totalPay, setTotalPay] = useState(0);

  useEffect(() => {
    setTotalPay(
      ordinaryRate * ordinaryHours
      + saturdayRate * saturdayHours
      + sundayRate * sundayHours
      + publicHolidayRate * publicHolidayHours
    )
    // Update the total cost only if the hours or rates change
  }, [ordinaryRate, ordinaryHours, saturdayRate, saturdayHours, sundayRate, sundayHours, publicHolidayRate, publicHolidayHours])

  return (
    <div>
      <Head>
        <title>Casual Pay Calculator</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container >
          <h1 style={{ textAlign: "center" }}>Casual Pay Calculator</h1>

          {/* Ordinary Rate */}
          <Form>
            <Form.Row>
              <Form.Group>
                <Form.Label>Ordinary</Form.Label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>$</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control value={ordinaryRate} type="number" onChange={event => setOrdinaryRate(parseFloat(event.target.value))} />
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label>Hours</Form.Label>
                <Form.Control value={ordinaryHours} type="number" onChange={event => setOrdinaryHours(parseFloat(event.target.value))} />
              </Form.Group>
            </Form.Row>



            {/* Saturday Rate */}
            <Form.Row>
              <Form.Group>
                <Form.Label>Saturday</Form.Label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>$</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control value={saturdayRate} type="number" onChange={event => setSaturdayRate(parseFloat(event.target.value))} />
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label>Hours</Form.Label>
                <Form.Control value={saturdayHours} type="number" onChange={event => setSaturdayHours(parseFloat(event.target.value))} />
              </Form.Group>
            </Form.Row>

            {/* Sunday Rate */}
            <Form.Row>
              <Form.Group>
                <Form.Label>Sunday</Form.Label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>$</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control value={sundayRate} type="number" onChange={event => setSundayRate(parseFloat(event.target.value))} />
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label>Hours</Form.Label>
                <Form.Control value={sundayHours} type="number" onChange={event => setSundayHours(parseFloat(event.target.value))} />
              </Form.Group>
            </Form.Row>

            {/* Public Holiday Rate */}
            <Form.Row>
              <Form.Group>
                <Form.Label>Holiday</Form.Label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>$</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control value={publicHolidayRate} type="number" onChange={event => setPublicHolidayRate(parseFloat(event.target.value))} />
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label>Hours</Form.Label>
                <Form.Control value={publicHolidayHours} type="number" onChange={event => setPublicHolidayHours(parseFloat(event.target.value))} />
              </Form.Group>
            </Form.Row>

          </Form>


          <h1>Total Pay: ${totalPay.toFixed(2)}</h1>

        </Container>
      </main>

      {/* TODO: ADD FOOTER */}
    </div >
  )
}
