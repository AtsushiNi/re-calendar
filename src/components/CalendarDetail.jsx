import { useState } from 'react'
import { TextField, ToggleButtonGroup, ToggleButton, Box, Stack } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
import dayjs from 'dayjs'

const CalendarDetail = () => {
  const [alignment, setAlignment] = useState('60minutes')
  const [startDate, setStartDate] = useState(dayjs())
  const [endDate, setEndDate] = useState(dayjs().add(2, 'w'))
  const [startTime, setStartTime] = useState(dayjs().hour(10))
  const [endTime, setEndTime] = useState(dayjs().hour(22))

  const today = (new Date())
  const dayString = today.getFullYear() + '/' + ('0' + (today.getMonth() + 1)).slice(-1) + '/' + ('0' + today.getDay()).slice(-2)

  return (
    <div style={{ width: '50%', padding: '20px' }}>
      <h1>calendar detail</h1>
      <Stack sx={{ width: 5000, maxWidth: '50%', margin: 'auto'}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', marginTop: '30px' }}>
          <div style={{fontWeight: 'bold', marginBottom: '10px'}}>カレンダー名</div>
          <TextField defaultValue={dayString + '作成のカレンダー'}/>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', marginTop: '30px' }}>
          <div style={{fontWeight: 'bold', marginBottom: '10px'}}>使用するカレンダー</div>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', marginTop: '30px' }}>
          <div style={{fontWeight: 'bold', marginBottom: '10px'}}>前後の確保時間</div>
          <ToggleButtonGroup value={alignment} color="primary">
            <ToggleButton value="30minutes" sx={{width: 'calc(100% / 3)'}}>30分</ToggleButton>
            <ToggleButton value="60minutes" sx={{width: 'calc(100% / 3)'}}>60分</ToggleButton>
            <ToggleButton value="90minutes" sx={{width: 'calc(100% / 3)'}}>90分</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', marginTop: '30px' }}>
          <div style={{fontWeight: 'bold', marginBottom: '10px'}}>候補日程</div>
          <Box sx={{display: 'flex'}}>
            <DesktopDatePicker
              inputFormat="MM/DD/YYYY"
              value={startDate}
              onChange={value => setStartDate(value)}
              renderInput={(params) => <TextField {...params} />}
            />
            <span>~</span>
            <DesktopDatePicker
              inputFormat="MM/DD/YYYY"
              value={endDate}
              onChange={value => setEndDate(value)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
        </Box>

        <Box sx={{ textAlign: 'left', marginTop: '30px' }}>
          <div style={{fontWeight: 'bold', marginBottom: '10px'}}>候補時間</div>
          <Box sx={{display: 'flex'}}>
            <MobileTimePicker
              value={startTime}
              onChange={value => setStartTime(value)}
              renderInput={params => <TextField {...params}/>}
            />
            <span>~</span>
            <MobileTimePicker
              value={endTime}
              onChange={value => setEndTime(value)}
              renderInput={params => <TextField {...params}/>}
            />
          </Box>
        </Box>
      </Stack>
    </div>
  )
}

export default CalendarDetail
