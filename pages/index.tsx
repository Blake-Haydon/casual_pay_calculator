import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import toast, { Toaster } from 'react-hot-toast'

export default function Home() {
  const WEBSITE_DOMAIN = "https://pay.calculator.haydon.dev"

  // Rates of pay state variables
  const [ordinaryRate, setOrdinaryRate] = useState("0");
  const [saturdayRate, setSaturdayRate] = useState("0");
  const [sundayRate, setSundayRate] = useState("0");
  const [publicHolidayRate, setPublicHolidayRate] = useState("0");

  // Number of hours worked state variables
  const [ordinaryHours, setOrdinaryHours] = useState("0");
  const [saturdayHours, setSaturdayHours] = useState("0");
  const [sundayHours, setSundayHours] = useState("0");
  const [publicHolidayHours, setPublicHolidayHours] = useState("0");

  // State variable to store the total pay
  const [totalPay, setTotalPay] = useState(0);
  const [totalTax, setTotalTax] = useState(0);

  const safeSet = (setFunction: any, value: string | null) => {
    // If the value is valid set it as the new value else ignore the input and don't change state
    if (value !== null && parseFloat(value) !== NaN && parseFloat(value) >= 0) {
      setFunction(value)
    }
    else if (value == "") {
      setFunction("")
    }
  }

  const parseFloatNoNaN = (value: string): number => {
    if (value == "") {
      return 0
    }
    return parseFloat(value)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    // Update the state with the query string on load if there are parameters, these should take precedence over the local state
    if (Array.from(urlParams).length !== 0) {
      urlParams.get("ordinaryRate") !== null && safeSet(setOrdinaryRate, urlParams.get("ordinaryRate"));
      urlParams.get("saturdayRate") !== null && safeSet(setSaturdayRate, urlParams.get("saturdayRate"));
      urlParams.get("sundayRate") !== null && safeSet(setSundayRate, urlParams.get("sundayRate"));
      urlParams.get("publicHolidayRate") !== null && safeSet(setPublicHolidayRate, urlParams.get("publicHolidayRate"));
    }
    // Update rates with local storage
    else {
      localStorage.getItem("ordinaryRate") !== null && safeSet(setOrdinaryRate, localStorage.getItem("ordinaryRate"));
      localStorage.getItem("saturdayRate") !== null && safeSet(setSaturdayRate, localStorage.getItem("saturdayRate"));
      localStorage.getItem("sundayRate") !== null && safeSet(setSundayRate, localStorage.getItem("sundayRate"));
      localStorage.getItem("publicHolidayRate") !== null && safeSet(setPublicHolidayRate, localStorage.getItem("publicHolidayRate"));
    }

    // Set hours from local storage
    localStorage.getItem("ordinaryHours") !== null && safeSet(setOrdinaryHours, localStorage.getItem("ordinaryHours"));
    localStorage.getItem("saturdayHours") !== null && safeSet(setSaturdayHours, localStorage.getItem("saturdayHours"));
    localStorage.getItem("sundayHours") !== null && safeSet(setSundayHours, localStorage.getItem("sundayHours"));
    localStorage.getItem("publicHolidayHours") !== null && safeSet(setPublicHolidayHours, localStorage.getItem("publicHolidayHours"));

  }, [])

  useEffect(() => {
    // Save the current values to local storage
    localStorage.setItem("ordinaryRate", ordinaryRate);
    localStorage.setItem("saturdayRate", saturdayRate);
    localStorage.setItem("sundayRate", sundayRate);
    localStorage.setItem("publicHolidayRate", publicHolidayRate);
    localStorage.setItem("ordinaryHours", ordinaryHours);
    localStorage.setItem("saturdayHours", saturdayHours);
    localStorage.setItem("sundayHours", sundayHours);
    localStorage.setItem("publicHolidayHours", publicHolidayHours);

    // Perform the tax calculations
    const MEDICARE_LEVY = 0.02;

    const totalWeeklyPayWithTax =
      parseFloatNoNaN(ordinaryRate) * parseFloatNoNaN(ordinaryHours)
      + parseFloatNoNaN(saturdayRate) * parseFloatNoNaN(saturdayHours)
      + parseFloatNoNaN(sundayRate) * parseFloatNoNaN(sundayHours)
      + parseFloatNoNaN(publicHolidayRate) * parseFloatNoNaN(publicHolidayHours);

    // THIS IS BASED OFF THE CURRENT TAX YEAR IN AUSTRALIA (2020–21 Resident tax rates) 
    const totalYearlyPayWithTax = 52 * totalWeeklyPayWithTax;
    let totalYearlyTax;

    // Nil
    // 0 – $18,200
    if (totalYearlyPayWithTax <= 18200) {
      totalYearlyTax = 0;
    }

    // 19 cents for each $1 over $18,200
    // $18,201 – $45,000
    else if (totalYearlyPayWithTax <= 45000) {
      totalYearlyTax = (totalYearlyPayWithTax - 18200) * 0.19 + totalYearlyPayWithTax * MEDICARE_LEVY;
    }

    // $5,092 plus 32.5 cents for each $1 over $45,000
    // $45,001 – $120,000
    else if (totalYearlyPayWithTax <= 120000) {
      totalYearlyTax = 5092 + (totalYearlyPayWithTax - 45000) + totalYearlyPayWithTax * MEDICARE_LEVY;
    }

    // $29,467 plus 37 cents for each $1 over $120,000
    // $120,001 – $180,000
    else if (totalYearlyPayWithTax <= 180000) {
      totalYearlyTax = 29467 + (totalYearlyPayWithTax - 120000) * 0.37 + totalYearlyPayWithTax * MEDICARE_LEVY;
    }

    // $51,667 plus 45 cents for each $1 over $180,000
    // $180,001 and over
    else {
      totalYearlyTax = 51667 + (totalYearlyPayWithTax - 180000) * 0.45 + totalYearlyPayWithTax * MEDICARE_LEVY;
    }

    const totalWeeklyTax = totalYearlyTax / 52
    const totalWeeklyPayMinusTax = totalWeeklyPayWithTax - totalWeeklyTax

    setTotalPay(totalWeeklyPayMinusTax);
    setTotalTax(totalWeeklyTax);

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
          <h1 className="my-3" style={{ textAlign: "center" }}>
            Weekly Casual Pay Calculator
          </h1>

          {/* Ordinary Rate */}
          <Form>
            <Form.Row className="my-3 pt-2 px-2" style={{ backgroundColor: "#f2f2f2", borderRadius: "5px" }}>
              <Form.Group as={Col} md="6" >
                <Form.Label>Ordinary Rate</Form.Label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>$</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control value={ordinaryRate} type="number" onChange={event => safeSet(setOrdinaryRate, event.target.value)} />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Hours Worked</Form.Label>
                <Form.Control value={ordinaryHours} type="number" onChange={event => safeSet(setOrdinaryHours, event.target.value)} />
              </Form.Group>
            </Form.Row>

            {/* Saturday Rate */}
            <Form.Row className="my-3 pt-2 px-2" style={{ backgroundColor: "#f2f2f2", borderRadius: "5px" }}>
              <Form.Group as={Col} md="6">
                <Form.Label>Saturday Rate</Form.Label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>$</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control value={saturdayRate} type="number" onChange={event => safeSet(setSaturdayRate, event.target.value)} />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Hours Worked</Form.Label>
                <Form.Control value={saturdayHours} type="number" onChange={event => safeSet(setSaturdayHours, event.target.value)} />
              </Form.Group>
            </Form.Row>

            {/* Sunday Rate */}
            <Form.Row className="my-3 pt-2 px-2" style={{ backgroundColor: "#f2f2f2", borderRadius: "5px" }}>
              <Form.Group as={Col} md="6" >
                <Form.Label>Sunday Rate</Form.Label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>$</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control value={sundayRate} type="number" onChange={event => safeSet(setSundayRate, event.target.value)} />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Hours Worked</Form.Label>
                <Form.Control value={sundayHours} type="number" onChange={event => safeSet(setSundayHours, event.target.value)} />
              </Form.Group>
            </Form.Row>

            {/* Public Holiday Rate */}
            <Form.Row className="my-3 pt-2 px-2" style={{ backgroundColor: "#f2f2f2", borderRadius: "5px" }}>
              <Form.Group as={Col} md="6" >
                <Form.Label>Holiday Rate</Form.Label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>$</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control value={publicHolidayRate} type="number" onChange={event => safeSet(setPublicHolidayRate, event.target.value)} />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Hours Worked</Form.Label>
                <Form.Control value={publicHolidayHours} type="number" onChange={event => safeSet(setPublicHolidayHours, event.target.value)} />
              </Form.Group>
            </Form.Row>

          </Form>

          <Row>
            <Col md="6" className="my-3">
              <Button variant="primary" onClick={() => {
                // Function that exports the 
                let exportedQueryRates = new URLSearchParams();

                // Append all of the rate data to the query string
                exportedQueryRates.append("ordinaryRate", (parseFloatNoNaN(ordinaryRate)).toString());
                exportedQueryRates.append("saturdayRate", (parseFloatNoNaN(saturdayRate)).toString());
                exportedQueryRates.append("sundayRate", (parseFloatNoNaN(sundayRate)).toString());
                exportedQueryRates.append("publicHolidayRate", (parseFloatNoNaN(publicHolidayRate)).toString());

                // Create the URL 
                const exportedRatesURL = WEBSITE_DOMAIN + "?" + exportedQueryRates.toString();

                // Copy the URL to the clipboard and present a toast to the user
                navigator.clipboard.writeText(exportedRatesURL);
                toast.success('Link Copied to Clipboard');
              }}>
                Copy Pay Rate Link
              </Button>
            </Col>
            <Col md="6" className="my-3">
              <Table bordered hover>
                <tbody>
                  <tr>
                    <td style={{ color: "green" }}>Total Pay</td>
                    <td style={{ textAlign: "right" }}>${totalPay.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "red" }}>Total Tax</td>
                    <td style={{ textAlign: "right" }}>${totalTax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Gross Pay</td>
                    <td style={{ textAlign: "right" }}>${(totalPay + totalTax).toFixed(2)}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </main>

      {/* TODO: ADD FOOTER */}

      {/* Add Hot Toast react element for export button */}
      <Toaster position="bottom-center" />
    </div>
  )
}
