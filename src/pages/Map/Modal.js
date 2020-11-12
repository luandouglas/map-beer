import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Picker } from 'react-native'

const { height } = Dimensions.get('window')

const Modal = ({ show, close, setFilter }) => {
  const [state, setState] = useState({
    opacity: new Animated.Value(0),
    container: new Animated.Value(height),
    modal: new Animated.Value(height)
  })
  const [filter, setFilters] = useState({ by_state: '', by_type: '', page: '', per_page: '' })
  const [types] = useState([
    { label: 'Todos', value: '' },
    { label: 'Micro', value: 'micro' },
    { label: 'Nano', value: 'nano' },
    { label: 'Regional', value: 'regional' },
    { label: 'Cervejaria', value: 'brewpub' },
    { label: 'Grande ', value: 'large' },
    { label: 'Ainda não aberta', value: 'planning' },
    { label: 'Bar', value: 'bar' },
    { label: 'Contrato', value: 'contract' },
    { label: 'Proprietária', value: 'proprietor' },
    { label: 'Fechada', value: 'closed' }
  ])
  const [states] = useState([
    { label: 'Todos', value: '' },
    { label: 'Alabama', value: 'alabama' },
    { label: 'Alasca', value: 'alaska' },
    { label: 'Arizona', value: 'arizona' },
    { label: 'Arkansas', value: 'arkansas' },
    { label: 'California', value: 'california' },
    { label: 'Carolina do Norte', value: 'north_carolina' },
    { label: 'Carolina do Sul', value: 'south_carolina' },
    { label: 'Colorado', value: 'colorado' },
    { label: 'Connecticut', value: 'connecticut' },
    { label: 'Dakota do Norte', value: 'north_dakota' },
    { label: 'Dakota do Sul', value: 'south_dakota' },
    { label: 'Delaeare', value: 'delaware' },
    { label: 'Distrito da Columbia', value: 'district_of_columbia' },
    { label: 'Florida', value: 'florida' },
    { label: 'Georgia', value: 'georgia' },
    { label: 'Hawaii', value: 'hawaii' },
    { label: 'Idaho', value: 'idaho' },
    { label: 'Illinois', value: 'illinois' },
    { label: 'Indiana', value: 'indiana' },
    { label: 'Kansas', value: 'kansas' },
    { label: 'Kentucky', value: 'kentucky' },
    { label: 'Louisiana', value: 'louisiana' },
    { label: 'Maine', value: 'maine' },
    { label: 'Maryland', value: 'maryland' },
    { label: 'Massachusetts', value: 'massachusetts' },
    { label: 'Michigan', value: 'michigan' },
    { label: 'Minnesota', value: 'minnesota' },
    { label: 'Mississipi', value: 'mississipi' },
    { label: 'Missouri', value: 'missouri' },
    { label: 'Nebraska', value: 'nebraska' },
    { label: 'Nevada', value: 'nevada' },
    { label: 'Nova Hampshire', value: 'new_hampshire' },
    { label: 'Nova Iorque', value: 'new_york' },
    { label: 'Nova Jersey', value: 'new_jersey' },
    { label: 'Novo Mexico', value: 'new_mexico' },
    { label: 'Ohio', value: 'ohio' },
    { label: 'Oklahoma', value: 'oklahoma' },
    { label: 'Oregon', value: 'oregon' },
    { label: 'Pensilvânia', value: 'pennsylvania' },
    { label: 'Rhode Island', value: 'rhode_island' },
    { label: 'Tennessee', value: 'tennessee' },
    { label: 'Texas', value: 'texas' },
    { label: 'Utah', value: 'utah' },
    { label: 'Vermont', value: 'vermont' },
    { label: 'Virgínia', value: 'virginia' },
    { label: 'Virgínia Ocidental', value: 'west_virginia' },
    { label: 'Washington', value: 'washington' },
    { label: 'Wisconsin', value: 'wisconsin' },
    { label: 'Wyoming', value: 'wyoming' },
  ])

  const openModal = () => {
    Animated.sequence([
      Animated.timing(state.container, { toValue: 0, duration: 100, useNativeDriver: true }),
      Animated.timing(state.opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(state.modal, { toValue: 0, bounciness: 5, useNativeDriver: true })
    ]).start()
  }

  const closeModal = () => {
    Animated.sequence([
      Animated.timing(state.modal, { toValue: height, duration: 250, useNativeDriver: true }),
      Animated.timing(state.opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(state.container, { toValue: height, duration: 100, useNativeDriver: true })
    ]).start()
  }

  useEffect(() => {
    if (show) {
      openModal()
    } else {
      closeModal()
    }
  }, [show])

  return (
    <Animated.View
      style={[styles.container, {
        opacity: state.opacity,
        transform: [
          { translateY: state.container }
        ]
      }]}
    >
      <Animated.View
        style={[styles.modal, {
          transform: [
            { translateY: state.modal }
          ]
        }]}
      >
        <View style={styles.indicator} />
        <View style={{ flex: 1, padding: 10 }}>
          <View style={styles.picker}>
            <Text style={{ position: 'absolute', top: -10, left: 10, paddingHorizontal: 5, backgroundColor: '#FFF', color: '#AAA' }}>Estado</Text>
            <Picker selectedValue={filter.by_state} onValueChange={by_state => setFilters(filter => ({ ...filter, by_state }))}>
              {states.map((item, index) =>
                <Picker.Item label={item.label} value={item.value} key={index} />
              )}
            </Picker>
          </View>
          <View style={styles.picker}>
            <Text style={{ position: 'absolute', top: -10, left: 10, paddingHorizontal: 5, backgroundColor: '#FFF', color: '#AAA' }}>Tipo</Text>
            <Picker selectedValue={filter.by_type} onValueChange={by_type => setFilters(filter => ({ ...filter, by_type }))}>
              {types.map((item, index) =>
                <Picker.Item label={item.label} value={item.value} key={index} />
              )}
            </Picker>
          </View>
        </View>
        <TouchableOpacity style={styles.btn} onPress={() => setFilter(filter)}>
          <Text style={{ color: '#fff' }}>Aplicar</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#AAA',
    borderRadius: 5,
    padding: 6,
    position: 'relative',
    marginBottom: 15
  },
  modal: {
    bottom: 0,
    position: 'absolute',
    height: '50%',
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 10
  },
  indicator: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 5
  },
  text: {
    marginTop: 50,
    textAlign: 'center'
  },
  btn: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#FFB15C',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  }
})

export default Modal