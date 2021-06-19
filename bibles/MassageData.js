const fs = require('fs')
const axios = require('axios')
const flatten = require('lodash.flatten')
const apiKey = 'abe1c86651b3f72bfdc3ff60319d3b7b'
const fileName = __dirname + '/CSBVersesTree.json'
const bibleId = 'a556c5305ee15c3f-01' // CSB
const CSBVerses = [
  {
    chapterId: 'GEN.1',
    count: 31
  },
  {
    chapterId: 'GEN.2',
    count: 25
  },
  {
    chapterId: 'GEN.3',
    count: 24
  },
  {
    chapterId: 'GEN.4',
    count: 26
  },
  {
    chapterId: 'GEN.5',
    count: 32
  },
  {
    chapterId: 'GEN.6',
    count: 22
  },
  {
    chapterId: 'GEN.7',
    count: 24
  },
  {
    chapterId: 'GEN.8',
    count: 22
  },
  {
    chapterId: 'GEN.9',
    count: 29
  },
  {
    chapterId: 'GEN.10',
    count: 32
  },
  {
    chapterId: 'GEN.11',
    count: 32
  },
  {
    chapterId: 'GEN.12',
    count: 20
  },
  {
    chapterId: 'GEN.13',
    count: 18
  },
  {
    chapterId: 'GEN.14',
    count: 24
  },
  {
    chapterId: 'GEN.15',
    count: 21
  },
  {
    chapterId: 'GEN.16',
    count: 16
  },
  {
    chapterId: 'GEN.17',
    count: 27
  },
  {
    chapterId: 'GEN.18',
    count: 33
  },
  {
    chapterId: 'GEN.19',
    count: 38
  },
  {
    chapterId: 'GEN.20',
    count: 18
  },
  {
    chapterId: 'GEN.21',
    count: 34
  },
  {
    chapterId: 'GEN.22',
    count: 24
  },
  {
    chapterId: 'GEN.23',
    count: 20
  },
  {
    chapterId: 'GEN.24',
    count: 67
  },
  {
    chapterId: 'GEN.25',
    count: 34
  },
  {
    chapterId: 'GEN.26',
    count: 35
  },
  {
    chapterId: 'GEN.27',
    count: 46
  },
  {
    chapterId: 'GEN.28',
    count: 22
  },
  {
    chapterId: 'GEN.29',
    count: 35
  },
  {
    chapterId: 'GEN.30',
    count: 43
  },
  {
    chapterId: 'GEN.31',
    count: 55
  },
  {
    chapterId: 'GEN.32',
    count: 32
  },
  {
    chapterId: 'GEN.33',
    count: 20
  },
  {
    chapterId: 'GEN.34',
    count: 31
  },
  {
    chapterId: 'GEN.35',
    count: 29
  },
  {
    chapterId: 'GEN.36',
    count: 43
  },
  {
    chapterId: 'GEN.37',
    count: 36
  },
  {
    chapterId: 'GEN.38',
    count: 30
  },
  {
    chapterId: 'GEN.39',
    count: 23
  },
  {
    chapterId: 'GEN.40',
    count: 23
  },
  {
    chapterId: 'GEN.41',
    count: 57
  },
  {
    chapterId: 'GEN.42',
    count: 38
  },
  {
    chapterId: 'GEN.43',
    count: 34
  },
  {
    chapterId: 'GEN.44',
    count: 34
  },
  {
    chapterId: 'GEN.45',
    count: 28
  },
  {
    chapterId: 'GEN.46',
    count: 34
  },
  {
    chapterId: 'GEN.47',
    count: 31
  },
  {
    chapterId: 'GEN.48',
    count: 22
  },
  {
    chapterId: 'GEN.49',
    count: 33
  },
  {
    chapterId: 'GEN.50',
    count: 26
  },
  {
    chapterId: 'EXO.1',
    count: 22
  },
  {
    chapterId: 'EXO.2',
    count: 25
  },
  {
    chapterId: 'EXO.3',
    count: 22
  },
  {
    chapterId: 'EXO.4',
    count: 31
  },
  {
    chapterId: 'EXO.5',
    count: 23
  },
  {
    chapterId: 'EXO.6',
    count: 30
  },
  {
    chapterId: 'EXO.7',
    count: 25
  },
  {
    chapterId: 'EXO.8',
    count: 32
  },
  {
    chapterId: 'EXO.9',
    count: 35
  },
  {
    chapterId: 'EXO.10',
    count: 29
  },
  {
    chapterId: 'EXO.11',
    count: 10
  },
  {
    chapterId: 'EXO.12',
    count: 51
  },
  {
    chapterId: 'EXO.13',
    count: 22
  },
  {
    chapterId: 'EXO.14',
    count: 31
  },
  {
    chapterId: 'EXO.15',
    count: 27
  },
  {
    chapterId: 'EXO.16',
    count: 36
  },
  {
    chapterId: 'EXO.17',
    count: 16
  },
  {
    chapterId: 'EXO.18',
    count: 27
  },
  {
    chapterId: 'EXO.19',
    count: 25
  },
  {
    chapterId: 'EXO.20',
    count: 26
  },
  {
    chapterId: 'EXO.21',
    count: 36
  },
  {
    chapterId: 'EXO.22',
    count: 31
  },
  {
    chapterId: 'EXO.23',
    count: 33
  },
  {
    chapterId: 'EXO.24',
    count: 18
  },
  {
    chapterId: 'EXO.25',
    count: 40
  },
  {
    chapterId: 'EXO.26',
    count: 37
  },
  {
    chapterId: 'EXO.27',
    count: 21
  },
  {
    chapterId: 'EXO.28',
    count: 43
  },
  {
    chapterId: 'EXO.29',
    count: 46
  },
  {
    chapterId: 'EXO.30',
    count: 38
  },
  {
    chapterId: 'EXO.31',
    count: 18
  },
  {
    chapterId: 'EXO.32',
    count: 35
  },
  {
    chapterId: 'EXO.33',
    count: 23
  },
  {
    chapterId: 'EXO.34',
    count: 35
  },
  {
    chapterId: 'EXO.35',
    count: 35
  },
  {
    chapterId: 'EXO.36',
    count: 38
  },
  {
    chapterId: 'EXO.37',
    count: 29
  },
  {
    chapterId: 'EXO.38',
    count: 31
  },
  {
    chapterId: 'EXO.39',
    count: 43
  },
  {
    chapterId: 'EXO.40',
    count: 38
  },
  {
    chapterId: 'LEV.1',
    count: 17
  },
  {
    chapterId: 'LEV.2',
    count: 16
  },
  {
    chapterId: 'LEV.3',
    count: 17
  },
  {
    chapterId: 'LEV.4',
    count: 35
  },
  {
    chapterId: 'LEV.5',
    count: 19
  },
  {
    chapterId: 'LEV.6',
    count: 30
  },
  {
    chapterId: 'LEV.7',
    count: 38
  },
  {
    chapterId: 'LEV.8',
    count: 36
  },
  {
    chapterId: 'LEV.9',
    count: 24
  },
  {
    chapterId: 'LEV.10',
    count: 20
  },
  {
    chapterId: 'LEV.11',
    count: 47
  },
  {
    chapterId: 'LEV.12',
    count: 8
  },
  {
    chapterId: 'LEV.13',
    count: 59
  },
  {
    chapterId: 'LEV.14',
    count: 57
  },
  {
    chapterId: 'LEV.15',
    count: 33
  },
  {
    chapterId: 'LEV.16',
    count: 34
  },
  {
    chapterId: 'LEV.17',
    count: 16
  },
  {
    chapterId: 'LEV.18',
    count: 30
  },
  {
    chapterId: 'LEV.19',
    count: 37
  },
  {
    chapterId: 'LEV.20',
    count: 27
  },
  {
    chapterId: 'LEV.21',
    count: 24
  },
  {
    chapterId: 'LEV.22',
    count: 33
  },
  {
    chapterId: 'LEV.23',
    count: 44
  },
  {
    chapterId: 'LEV.24',
    count: 23
  },
  {
    chapterId: 'LEV.25',
    count: 55
  },
  {
    chapterId: 'LEV.26',
    count: 46
  },
  {
    chapterId: 'LEV.27',
    count: 34
  },
  {
    chapterId: 'NUM.1',
    count: 54
  },
  {
    chapterId: 'NUM.2',
    count: 34
  },
  {
    chapterId: 'NUM.3',
    count: 51
  },
  {
    chapterId: 'NUM.4',
    count: 49
  },
  {
    chapterId: 'NUM.5',
    count: 31
  },
  {
    chapterId: 'NUM.6',
    count: 27
  },
  {
    chapterId: 'NUM.7',
    count: 89
  },
  {
    chapterId: 'NUM.8',
    count: 26
  },
  {
    chapterId: 'NUM.9',
    count: 23
  },
  {
    chapterId: 'NUM.10',
    count: 36
  },
  {
    chapterId: 'NUM.11',
    count: 35
  },
  {
    chapterId: 'NUM.12',
    count: 16
  },
  {
    chapterId: 'NUM.13',
    count: 33
  },
  {
    chapterId: 'NUM.14',
    count: 45
  },
  {
    chapterId: 'NUM.15',
    count: 41
  },
  {
    chapterId: 'NUM.16',
    count: 50
  },
  {
    chapterId: 'NUM.17',
    count: 13
  },
  {
    chapterId: 'NUM.18',
    count: 32
  },
  {
    chapterId: 'NUM.19',
    count: 22
  },
  {
    chapterId: 'NUM.20',
    count: 29
  },
  {
    chapterId: 'NUM.21',
    count: 35
  },
  {
    chapterId: 'NUM.22',
    count: 41
  },
  {
    chapterId: 'NUM.23',
    count: 30
  },
  {
    chapterId: 'NUM.24',
    count: 25
  },
  {
    chapterId: 'NUM.25',
    count: 18
  },
  {
    chapterId: 'NUM.26',
    count: 65
  },
  {
    chapterId: 'NUM.27',
    count: 23
  },
  {
    chapterId: 'NUM.28',
    count: 31
  },
  {
    chapterId: 'NUM.29',
    count: 40
  },
  {
    chapterId: 'NUM.30',
    count: 16
  },
  {
    chapterId: 'NUM.31',
    count: 54
  },
  {
    chapterId: 'NUM.32',
    count: 42
  },
  {
    chapterId: 'NUM.33',
    count: 56
  },
  {
    chapterId: 'NUM.34',
    count: 29
  },
  {
    chapterId: 'NUM.35',
    count: 34
  },
  {
    chapterId: 'NUM.36',
    count: 13
  },
  {
    chapterId: 'DEU.1',
    count: 46
  },
  {
    chapterId: 'DEU.2',
    count: 37
  },
  {
    chapterId: 'DEU.3',
    count: 29
  },
  {
    chapterId: 'DEU.4',
    count: 49
  },
  {
    chapterId: 'DEU.5',
    count: 33
  },
  {
    chapterId: 'DEU.6',
    count: 25
  },
  {
    chapterId: 'DEU.7',
    count: 26
  },
  {
    chapterId: 'DEU.8',
    count: 20
  },
  {
    chapterId: 'DEU.9',
    count: 29
  },
  {
    chapterId: 'DEU.10',
    count: 22
  },
  {
    chapterId: 'DEU.11',
    count: 32
  },
  {
    chapterId: 'DEU.12',
    count: 32
  },
  {
    chapterId: 'DEU.13',
    count: 18
  },
  {
    chapterId: 'DEU.14',
    count: 29
  },
  {
    chapterId: 'DEU.15',
    count: 23
  },
  {
    chapterId: 'DEU.16',
    count: 22
  },
  {
    chapterId: 'DEU.17',
    count: 20
  },
  {
    chapterId: 'DEU.18',
    count: 22
  },
  {
    chapterId: 'DEU.19',
    count: 21
  },
  {
    chapterId: 'DEU.20',
    count: 20
  },
  {
    chapterId: 'DEU.21',
    count: 23
  },
  {
    chapterId: 'DEU.22',
    count: 30
  },
  {
    chapterId: 'DEU.23',
    count: 25
  },
  {
    chapterId: 'DEU.24',
    count: 22
  },
  {
    chapterId: 'DEU.25',
    count: 19
  },
  {
    chapterId: 'DEU.26',
    count: 19
  },
  {
    chapterId: 'DEU.27',
    count: 26
  },
  {
    chapterId: 'DEU.28',
    count: 68
  },
  {
    chapterId: 'DEU.29',
    count: 29
  },
  {
    chapterId: 'DEU.30',
    count: 20
  },
  {
    chapterId: 'DEU.31',
    count: 30
  },
  {
    chapterId: 'DEU.32',
    count: 52
  },
  {
    chapterId: 'DEU.33',
    count: 29
  },
  {
    chapterId: 'DEU.34',
    count: 12
  },
  {
    chapterId: 'JOS.1',
    count: 18
  },
  {
    chapterId: 'JOS.2',
    count: 24
  },
  {
    chapterId: 'JOS.3',
    count: 17
  },
  {
    chapterId: 'JOS.4',
    count: 24
  },
  {
    chapterId: 'JOS.5',
    count: 15
  },
  {
    chapterId: 'JOS.6',
    count: 27
  },
  {
    chapterId: 'JOS.7',
    count: 26
  },
  {
    chapterId: 'JOS.8',
    count: 35
  },
  {
    chapterId: 'JOS.9',
    count: 27
  },
  {
    chapterId: 'JOS.10',
    count: 43
  },
  {
    chapterId: 'JOS.11',
    count: 23
  },
  {
    chapterId: 'JOS.12',
    count: 24
  },
  {
    chapterId: 'JOS.13',
    count: 33
  },
  {
    chapterId: 'JOS.14',
    count: 15
  },
  {
    chapterId: 'JOS.15',
    count: 63
  },
  {
    chapterId: 'JOS.16',
    count: 10
  },
  {
    chapterId: 'JOS.17',
    count: 18
  },
  {
    chapterId: 'JOS.18',
    count: 28
  },
  {
    chapterId: 'JOS.19',
    count: 51
  },
  {
    chapterId: 'JOS.20',
    count: 9
  },
  {
    chapterId: 'JOS.21',
    count: 45
  },
  {
    chapterId: 'JOS.22',
    count: 34
  },
  {
    chapterId: 'JOS.23',
    count: 16
  },
  {
    chapterId: 'JOS.24',
    count: 33
  },
  {
    chapterId: 'JDG.1',
    count: 36
  },
  {
    chapterId: 'JDG.2',
    count: 23
  },
  {
    chapterId: 'JDG.3',
    count: 31
  },
  {
    chapterId: 'JDG.4',
    count: 24
  },
  {
    chapterId: 'JDG.5',
    count: 31
  },
  {
    chapterId: 'JDG.6',
    count: 40
  },
  {
    chapterId: 'JDG.7',
    count: 25
  },
  {
    chapterId: 'JDG.8',
    count: 35
  },
  {
    chapterId: 'JDG.9',
    count: 57
  },
  {
    chapterId: 'JDG.10',
    count: 18
  },
  {
    chapterId: 'JDG.11',
    count: 40
  },
  {
    chapterId: 'JDG.12',
    count: 15
  },
  {
    chapterId: 'JDG.13',
    count: 25
  },
  {
    chapterId: 'JDG.14',
    count: 20
  },
  {
    chapterId: 'JDG.15',
    count: 20
  },
  {
    chapterId: 'JDG.16',
    count: 31
  },
  {
    chapterId: 'JDG.17',
    count: 13
  },
  {
    chapterId: 'JDG.18',
    count: 31
  },
  {
    chapterId: 'JDG.19',
    count: 30
  },
  {
    chapterId: 'JDG.20',
    count: 48
  },
  {
    chapterId: 'JDG.21',
    count: 25
  },
  {
    chapterId: 'RUT.1',
    count: 22
  },
  {
    chapterId: 'RUT.2',
    count: 23
  },
  {
    chapterId: 'RUT.3',
    count: 18
  },
  {
    chapterId: 'RUT.4',
    count: 22
  },
  {
    chapterId: '1SA.1',
    count: 28
  },
  {
    chapterId: '1SA.2',
    count: 36
  },
  {
    chapterId: '1SA.3',
    count: 21
  },
  {
    chapterId: '1SA.4',
    count: 22
  },
  {
    chapterId: '1SA.5',
    count: 12
  },
  {
    chapterId: '1SA.6',
    count: 21
  },
  {
    chapterId: '1SA.7',
    count: 17
  },
  {
    chapterId: '1SA.8',
    count: 22
  },
  {
    chapterId: '1SA.9',
    count: 27
  },
  {
    chapterId: '1SA.10',
    count: 27
  },
  {
    chapterId: '1SA.11',
    count: 15
  },
  {
    chapterId: '1SA.12',
    count: 25
  },
  {
    chapterId: '1SA.13',
    count: 23
  },
  {
    chapterId: '1SA.14',
    count: 52
  },
  {
    chapterId: '1SA.15',
    count: 35
  },
  {
    chapterId: '1SA.16',
    count: 23
  },
  {
    chapterId: '1SA.17',
    count: 58
  },
  {
    chapterId: '1SA.18',
    count: 30
  },
  {
    chapterId: '1SA.19',
    count: 24
  },
  {
    chapterId: '1SA.20',
    count: 42
  },
  {
    chapterId: '1SA.21',
    count: 15
  },
  {
    chapterId: '1SA.22',
    count: 23
  },
  {
    chapterId: '1SA.23',
    count: 29
  },
  {
    chapterId: '1SA.24',
    count: 22
  },
  {
    chapterId: '1SA.25',
    count: 44
  },
  {
    chapterId: '1SA.26',
    count: 25
  },
  {
    chapterId: '1SA.27',
    count: 12
  },
  {
    chapterId: '1SA.28',
    count: 25
  },
  {
    chapterId: '1SA.29',
    count: 11
  },
  {
    chapterId: '1SA.30',
    count: 31
  },
  {
    chapterId: '1SA.31',
    count: 13
  },
  {
    chapterId: '2SA.1',
    count: 27
  },
  {
    chapterId: '2SA.2',
    count: 32
  },
  {
    chapterId: '2SA.3',
    count: 39
  },
  {
    chapterId: '2SA.4',
    count: 12
  },
  {
    chapterId: '2SA.5',
    count: 25
  },
  {
    chapterId: '2SA.6',
    count: 23
  },
  {
    chapterId: '2SA.7',
    count: 29
  },
  {
    chapterId: '2SA.8',
    count: 18
  },
  {
    chapterId: '2SA.9',
    count: 13
  },
  {
    chapterId: '2SA.10',
    count: 19
  },
  {
    chapterId: '2SA.11',
    count: 27
  },
  {
    chapterId: '2SA.12',
    count: 31
  },
  {
    chapterId: '2SA.13',
    count: 39
  },
  {
    chapterId: '2SA.14',
    count: 33
  },
  {
    chapterId: '2SA.15',
    count: 37
  },
  {
    chapterId: '2SA.16',
    count: 23
  },
  {
    chapterId: '2SA.17',
    count: 29
  },
  {
    chapterId: '2SA.18',
    count: 33
  },
  {
    chapterId: '2SA.19',
    count: 43
  },
  {
    chapterId: '2SA.20',
    count: 26
  },
  {
    chapterId: '2SA.21',
    count: 22
  },
  {
    chapterId: '2SA.22',
    count: 51
  },
  {
    chapterId: '2SA.23',
    count: 39
  },
  {
    chapterId: '2SA.24',
    count: 25
  },
  {
    chapterId: '1KI.1',
    count: 53
  },
  {
    chapterId: '1KI.2',
    count: 46
  },
  {
    chapterId: '1KI.3',
    count: 28
  },
  {
    chapterId: '1KI.4',
    count: 34
  },
  {
    chapterId: '1KI.5',
    count: 18
  },
  {
    chapterId: '1KI.6',
    count: 38
  },
  {
    chapterId: '1KI.7',
    count: 51
  },
  {
    chapterId: '1KI.8',
    count: 66
  },
  {
    chapterId: '1KI.9',
    count: 28
  },
  {
    chapterId: '1KI.10',
    count: 29
  },
  {
    chapterId: '1KI.11',
    count: 43
  },
  {
    chapterId: '1KI.12',
    count: 33
  },
  {
    chapterId: '1KI.13',
    count: 34
  },
  {
    chapterId: '1KI.14',
    count: 31
  },
  {
    chapterId: '1KI.15',
    count: 34
  },
  {
    chapterId: '1KI.16',
    count: 34
  },
  {
    chapterId: '1KI.17',
    count: 24
  },
  {
    chapterId: '1KI.18',
    count: 46
  },
  {
    chapterId: '1KI.19',
    count: 21
  },
  {
    chapterId: '1KI.20',
    count: 43
  },
  {
    chapterId: '1KI.21',
    count: 29
  },
  {
    chapterId: '1KI.22',
    count: 53
  },
  {
    chapterId: '2KI.1',
    count: 18
  },
  {
    chapterId: '2KI.2',
    count: 25
  },
  {
    chapterId: '2KI.3',
    count: 27
  },
  {
    chapterId: '2KI.4',
    count: 44
  },
  {
    chapterId: '2KI.5',
    count: 27
  },
  {
    chapterId: '2KI.6',
    count: 33
  },
  {
    chapterId: '2KI.7',
    count: 20
  },
  {
    chapterId: '2KI.8',
    count: 29
  },
  {
    chapterId: '2KI.9',
    count: 37
  },
  {
    chapterId: '2KI.10',
    count: 36
  },
  {
    chapterId: '2KI.11',
    count: 21
  },
  {
    chapterId: '2KI.12',
    count: 21
  },
  {
    chapterId: '2KI.13',
    count: 25
  },
  {
    chapterId: '2KI.14',
    count: 29
  },
  {
    chapterId: '2KI.15',
    count: 38
  },
  {
    chapterId: '2KI.16',
    count: 20
  },
  {
    chapterId: '2KI.17',
    count: 41
  },
  {
    chapterId: '2KI.18',
    count: 37
  },
  {
    chapterId: '2KI.19',
    count: 37
  },
  {
    chapterId: '2KI.20',
    count: 21
  },
  {
    chapterId: '2KI.21',
    count: 26
  },
  {
    chapterId: '2KI.22',
    count: 20
  },
  {
    chapterId: '2KI.23',
    count: 37
  },
  {
    chapterId: '2KI.24',
    count: 20
  },
  {
    chapterId: '2KI.25',
    count: 30
  },
  {
    chapterId: '1CH.1',
    count: 54
  },
  {
    chapterId: '1CH.2',
    count: 55
  },
  {
    chapterId: '1CH.3',
    count: 24
  },
  {
    chapterId: '1CH.4',
    count: 43
  },
  {
    chapterId: '1CH.5',
    count: 26
  },
  {
    chapterId: '1CH.6',
    count: 81
  },
  {
    chapterId: '1CH.7',
    count: 40
  },
  {
    chapterId: '1CH.8',
    count: 40
  },
  {
    chapterId: '1CH.9',
    count: 44
  },
  {
    chapterId: '1CH.10',
    count: 14
  },
  {
    chapterId: '1CH.11',
    count: 47
  },
  {
    chapterId: '1CH.12',
    count: 40
  },
  {
    chapterId: '1CH.13',
    count: 14
  },
  {
    chapterId: '1CH.14',
    count: 17
  },
  {
    chapterId: '1CH.15',
    count: 29
  },
  {
    chapterId: '1CH.16',
    count: 43
  },
  {
    chapterId: '1CH.17',
    count: 27
  },
  {
    chapterId: '1CH.18',
    count: 17
  },
  {
    chapterId: '1CH.19',
    count: 19
  },
  {
    chapterId: '1CH.20',
    count: 8
  },
  {
    chapterId: '1CH.21',
    count: 30
  },
  {
    chapterId: '1CH.22',
    count: 19
  },
  {
    chapterId: '1CH.23',
    count: 32
  },
  {
    chapterId: '1CH.24',
    count: 31
  },
  {
    chapterId: '1CH.25',
    count: 31
  },
  {
    chapterId: '1CH.26',
    count: 32
  },
  {
    chapterId: '1CH.27',
    count: 34
  },
  {
    chapterId: '1CH.28',
    count: 21
  },
  {
    chapterId: '1CH.29',
    count: 30
  },
  {
    chapterId: '2CH.1',
    count: 17
  },
  {
    chapterId: '2CH.2',
    count: 18
  },
  {
    chapterId: '2CH.3',
    count: 17
  },
  {
    chapterId: '2CH.4',
    count: 22
  },
  {
    chapterId: '2CH.5',
    count: 14
  },
  {
    chapterId: '2CH.6',
    count: 42
  },
  {
    chapterId: '2CH.7',
    count: 22
  },
  {
    chapterId: '2CH.8',
    count: 18
  },
  {
    chapterId: '2CH.9',
    count: 31
  },
  {
    chapterId: '2CH.10',
    count: 19
  },
  {
    chapterId: '2CH.11',
    count: 23
  },
  {
    chapterId: '2CH.12',
    count: 16
  },
  {
    chapterId: '2CH.13',
    count: 22
  },
  {
    chapterId: '2CH.14',
    count: 15
  },
  {
    chapterId: '2CH.15',
    count: 19
  },
  {
    chapterId: '2CH.16',
    count: 14
  },
  {
    chapterId: '2CH.17',
    count: 19
  },
  {
    chapterId: '2CH.18',
    count: 34
  },
  {
    chapterId: '2CH.19',
    count: 11
  },
  {
    chapterId: '2CH.20',
    count: 37
  },
  {
    chapterId: '2CH.21',
    count: 20
  },
  {
    chapterId: '2CH.22',
    count: 12
  },
  {
    chapterId: '2CH.23',
    count: 21
  },
  {
    chapterId: '2CH.24',
    count: 27
  },
  {
    chapterId: '2CH.25',
    count: 28
  },
  {
    chapterId: '2CH.26',
    count: 23
  },
  {
    chapterId: '2CH.27',
    count: 9
  },
  {
    chapterId: '2CH.28',
    count: 27
  },
  {
    chapterId: '2CH.29',
    count: 36
  },
  {
    chapterId: '2CH.30',
    count: 27
  },
  {
    chapterId: '2CH.31',
    count: 21
  },
  {
    chapterId: '2CH.32',
    count: 33
  },
  {
    chapterId: '2CH.33',
    count: 25
  },
  {
    chapterId: '2CH.34',
    count: 33
  },
  {
    chapterId: '2CH.35',
    count: 27
  },
  {
    chapterId: '2CH.36',
    count: 23
  },
  {
    chapterId: 'EZR.1',
    count: 11
  },
  {
    chapterId: 'EZR.2',
    count: 70
  },
  {
    chapterId: 'EZR.3',
    count: 13
  },
  {
    chapterId: 'EZR.4',
    count: 24
  },
  {
    chapterId: 'EZR.5',
    count: 17
  },
  {
    chapterId: 'EZR.6',
    count: 22
  },
  {
    chapterId: 'EZR.7',
    count: 28
  },
  {
    chapterId: 'EZR.8',
    count: 36
  },
  {
    chapterId: 'EZR.9',
    count: 15
  },
  {
    chapterId: 'EZR.10',
    count: 44
  },
  {
    chapterId: 'NEH.1',
    count: 11
  },
  {
    chapterId: 'NEH.2',
    count: 20
  },
  {
    chapterId: 'NEH.3',
    count: 32
  },
  {
    chapterId: 'NEH.4',
    count: 23
  },
  {
    chapterId: 'NEH.5',
    count: 19
  },
  {
    chapterId: 'NEH.6',
    count: 19
  },
  {
    chapterId: 'NEH.7',
    count: 73
  },
  {
    chapterId: 'NEH.8',
    count: 18
  },
  {
    chapterId: 'NEH.9',
    count: 38
  },
  {
    chapterId: 'NEH.10',
    count: 39
  },
  {
    chapterId: 'NEH.11',
    count: 36
  },
  {
    chapterId: 'NEH.12',
    count: 47
  },
  {
    chapterId: 'NEH.13',
    count: 31
  },
  {
    chapterId: 'EST.1',
    count: 22
  },
  {
    chapterId: 'EST.2',
    count: 23
  },
  {
    chapterId: 'EST.3',
    count: 15
  },
  {
    chapterId: 'EST.4',
    count: 17
  },
  {
    chapterId: 'EST.5',
    count: 14
  },
  {
    chapterId: 'EST.6',
    count: 14
  },
  {
    chapterId: 'EST.7',
    count: 10
  },
  {
    chapterId: 'EST.8',
    count: 17
  },
  {
    chapterId: 'EST.9',
    count: 32
  },
  {
    chapterId: 'EST.10',
    count: 3
  },
  {
    chapterId: 'JOB.1',
    count: 22
  },
  {
    chapterId: 'JOB.2',
    count: 13
  },
  {
    chapterId: 'JOB.3',
    count: 26
  },
  {
    chapterId: 'JOB.4',
    count: 21
  },
  {
    chapterId: 'JOB.5',
    count: 27
  },
  {
    chapterId: 'JOB.6',
    count: 30
  },
  {
    chapterId: 'JOB.7',
    count: 21
  },
  {
    chapterId: 'JOB.8',
    count: 22
  },
  {
    chapterId: 'JOB.9',
    count: 35
  },
  {
    chapterId: 'JOB.10',
    count: 22
  },
  {
    chapterId: 'JOB.11',
    count: 20
  },
  {
    chapterId: 'JOB.12',
    count: 25
  },
  {
    chapterId: 'JOB.13',
    count: 28
  },
  {
    chapterId: 'JOB.14',
    count: 22
  },
  {
    chapterId: 'JOB.15',
    count: 35
  },
  {
    chapterId: 'JOB.16',
    count: 22
  },
  {
    chapterId: 'JOB.17',
    count: 16
  },
  {
    chapterId: 'JOB.18',
    count: 21
  },
  {
    chapterId: 'JOB.19',
    count: 29
  },
  {
    chapterId: 'JOB.20',
    count: 29
  },
  {
    chapterId: 'JOB.21',
    count: 34
  },
  {
    chapterId: 'JOB.22',
    count: 30
  },
  {
    chapterId: 'JOB.23',
    count: 17
  },
  {
    chapterId: 'JOB.24',
    count: 25
  },
  {
    chapterId: 'JOB.25',
    count: 6
  },
  {
    chapterId: 'JOB.26',
    count: 14
  },
  {
    chapterId: 'JOB.27',
    count: 23
  },
  {
    chapterId: 'JOB.28',
    count: 28
  },
  {
    chapterId: 'JOB.29',
    count: 25
  },
  {
    chapterId: 'JOB.30',
    count: 31
  },
  {
    chapterId: 'JOB.31',
    count: 40
  },
  {
    chapterId: 'JOB.32',
    count: 22
  },
  {
    chapterId: 'JOB.33',
    count: 33
  },
  {
    chapterId: 'JOB.34',
    count: 37
  },
  {
    chapterId: 'JOB.35',
    count: 16
  },
  {
    chapterId: 'JOB.36',
    count: 33
  },
  {
    chapterId: 'JOB.37',
    count: 24
  },
  {
    chapterId: 'JOB.38',
    count: 41
  },
  {
    chapterId: 'JOB.39',
    count: 30
  },
  {
    chapterId: 'JOB.40',
    count: 24
  },
  {
    chapterId: 'JOB.41',
    count: 34
  },
  {
    chapterId: 'JOB.42',
    count: 17
  },
  {
    chapterId: 'PSA.intro',
    count: 1
  },
  {
    chapterId: 'PSA.1',
    count: 6
  },
  {
    chapterId: 'PSA.2',
    count: 12
  },
  {
    chapterId: 'PSA.3',
    count: 8
  },
  {
    chapterId: 'PSA.4',
    count: 8
  },
  {
    chapterId: 'PSA.5',
    count: 12
  },
  {
    chapterId: 'PSA.6',
    count: 10
  },
  {
    chapterId: 'PSA.7',
    count: 17
  },
  {
    chapterId: 'PSA.8',
    count: 9
  },
  {
    chapterId: 'PSA.9',
    count: 20
  },
  {
    chapterId: 'PSA.10',
    count: 18
  },
  {
    chapterId: 'PSA.11',
    count: 7
  },
  {
    chapterId: 'PSA.12',
    count: 8
  },
  {
    chapterId: 'PSA.13',
    count: 6
  },
  {
    chapterId: 'PSA.14',
    count: 7
  },
  {
    chapterId: 'PSA.15',
    count: 5
  },
  {
    chapterId: 'PSA.16',
    count: 11
  },
  {
    chapterId: 'PSA.17',
    count: 15
  },
  {
    chapterId: 'PSA.18',
    count: 50
  },
  {
    chapterId: 'PSA.19',
    count: 14
  },
  {
    chapterId: 'PSA.20',
    count: 9
  },
  {
    chapterId: 'PSA.21',
    count: 13
  },
  {
    chapterId: 'PSA.22',
    count: 31
  },
  {
    chapterId: 'PSA.23',
    count: 6
  },
  {
    chapterId: 'PSA.24',
    count: 10
  },
  {
    chapterId: 'PSA.25',
    count: 22
  },
  {
    chapterId: 'PSA.26',
    count: 12
  },
  {
    chapterId: 'PSA.27',
    count: 14
  },
  {
    chapterId: 'PSA.28',
    count: 9
  },
  {
    chapterId: 'PSA.29',
    count: 11
  },
  {
    chapterId: 'PSA.30',
    count: 12
  },
  {
    chapterId: 'PSA.31',
    count: 24
  },
  {
    chapterId: 'PSA.32',
    count: 11
  },
  {
    chapterId: 'PSA.33',
    count: 22
  },
  {
    chapterId: 'PSA.34',
    count: 22
  },
  {
    chapterId: 'PSA.35',
    count: 28
  },
  {
    chapterId: 'PSA.36',
    count: 12
  },
  {
    chapterId: 'PSA.37',
    count: 40
  },
  {
    chapterId: 'PSA.38',
    count: 22
  },
  {
    chapterId: 'PSA.39',
    count: 13
  },
  {
    chapterId: 'PSA.40',
    count: 17
  },
  {
    chapterId: 'PSA.41',
    count: 13
  },
  {
    chapterId: 'PSA.42',
    count: 11
  },
  {
    chapterId: 'PSA.43',
    count: 5
  },
  {
    chapterId: 'PSA.44',
    count: 26
  },
  {
    chapterId: 'PSA.45',
    count: 17
  },
  {
    chapterId: 'PSA.46',
    count: 11
  },
  {
    chapterId: 'PSA.47',
    count: 9
  },
  {
    chapterId: 'PSA.48',
    count: 14
  },
  {
    chapterId: 'PSA.49',
    count: 20
  },
  {
    chapterId: 'PSA.50',
    count: 23
  },
  {
    chapterId: 'PSA.51',
    count: 19
  },
  {
    chapterId: 'PSA.52',
    count: 9
  },
  {
    chapterId: 'PSA.53',
    count: 6
  },
  {
    chapterId: 'PSA.54',
    count: 7
  },
  {
    chapterId: 'PSA.55',
    count: 23
  },
  {
    chapterId: 'PSA.56',
    count: 13
  },
  {
    chapterId: 'PSA.57',
    count: 11
  },
  {
    chapterId: 'PSA.58',
    count: 11
  },
  {
    chapterId: 'PSA.59',
    count: 17
  },
  {
    chapterId: 'PSA.60',
    count: 12
  },
  {
    chapterId: 'PSA.61',
    count: 8
  },
  {
    chapterId: 'PSA.62',
    count: 12
  },
  {
    chapterId: 'PSA.63',
    count: 11
  },
  {
    chapterId: 'PSA.64',
    count: 10
  },
  {
    chapterId: 'PSA.65',
    count: 13
  },
  {
    chapterId: 'PSA.66',
    count: 20
  },
  {
    chapterId: 'PSA.67',
    count: 7
  },
  {
    chapterId: 'PSA.68',
    count: 35
  },
  {
    chapterId: 'PSA.69',
    count: 36
  },
  {
    chapterId: 'PSA.70',
    count: 5
  },
  {
    chapterId: 'PSA.71',
    count: 24
  },
  {
    chapterId: 'PSA.72',
    count: 20
  },
  {
    chapterId: 'PSA.73',
    count: 28
  },
  {
    chapterId: 'PSA.74',
    count: 23
  },
  {
    chapterId: 'PSA.75',
    count: 10
  },
  {
    chapterId: 'PSA.76',
    count: 12
  },
  {
    chapterId: 'PSA.77',
    count: 20
  },
  {
    chapterId: 'PSA.78',
    count: 72
  },
  {
    chapterId: 'PSA.79',
    count: 13
  },
  {
    chapterId: 'PSA.80',
    count: 19
  },
  {
    chapterId: 'PSA.81',
    count: 16
  },
  {
    chapterId: 'PSA.82',
    count: 8
  },
  {
    chapterId: 'PSA.83',
    count: 18
  },
  {
    chapterId: 'PSA.84',
    count: 12
  },
  {
    chapterId: 'PSA.85',
    count: 13
  },
  {
    chapterId: 'PSA.86',
    count: 17
  },
  {
    chapterId: 'PSA.87',
    count: 7
  },
  {
    chapterId: 'PSA.88',
    count: 18
  },
  {
    chapterId: 'PSA.89',
    count: 52
  },
  {
    chapterId: 'PSA.90',
    count: 17
  },
  {
    chapterId: 'PSA.91',
    count: 16
  },
  {
    chapterId: 'PSA.92',
    count: 15
  },
  {
    chapterId: 'PSA.93',
    count: 5
  },
  {
    chapterId: 'PSA.94',
    count: 23
  },
  {
    chapterId: 'PSA.95',
    count: 11
  },
  {
    chapterId: 'PSA.96',
    count: 13
  },
  {
    chapterId: 'PSA.97',
    count: 12
  },
  {
    chapterId: 'PSA.98',
    count: 9
  },
  {
    chapterId: 'PSA.99',
    count: 9
  },
  {
    chapterId: 'PSA.100',
    count: 5
  },
  {
    chapterId: 'PSA.101',
    count: 8
  },
  {
    chapterId: 'PSA.102',
    count: 28
  },
  {
    chapterId: 'PSA.103',
    count: 22
  },
  {
    chapterId: 'PSA.104',
    count: 35
  },
  {
    chapterId: 'PSA.105',
    count: 45
  },
  {
    chapterId: 'PSA.106',
    count: 48
  },
  {
    chapterId: 'PSA.107',
    count: 43
  },
  {
    chapterId: 'PSA.108',
    count: 13
  },
  {
    chapterId: 'PSA.109',
    count: 31
  },
  {
    chapterId: 'PSA.110',
    count: 7
  },
  {
    chapterId: 'PSA.111',
    count: 10
  },
  {
    chapterId: 'PSA.112',
    count: 10
  },
  {
    chapterId: 'PSA.113',
    count: 9
  },
  {
    chapterId: 'PSA.114',
    count: 8
  },
  {
    chapterId: 'PSA.115',
    count: 18
  },
  {
    chapterId: 'PSA.116',
    count: 19
  },
  {
    chapterId: 'PSA.117',
    count: 2
  },
  {
    chapterId: 'PSA.118',
    count: 29
  },
  {
    chapterId: 'PSA.119',
    count: 176
  },
  {
    chapterId: 'PSA.120',
    count: 7
  },
  {
    chapterId: 'PSA.121',
    count: 8
  },
  {
    chapterId: 'PSA.122',
    count: 9
  },
  {
    chapterId: 'PSA.123',
    count: 4
  },
  {
    chapterId: 'PSA.124',
    count: 8
  },
  {
    chapterId: 'PSA.125',
    count: 5
  },
  {
    chapterId: 'PSA.126',
    count: 6
  },
  {
    chapterId: 'PSA.127',
    count: 5
  },
  {
    chapterId: 'PSA.128',
    count: 6
  },
  {
    chapterId: 'PSA.129',
    count: 8
  },
  {
    chapterId: 'PSA.130',
    count: 8
  },
  {
    chapterId: 'PSA.131',
    count: 3
  },
  {
    chapterId: 'PSA.132',
    count: 18
  },
  {
    chapterId: 'PSA.133',
    count: 3
  },
  {
    chapterId: 'PSA.134',
    count: 3
  },
  {
    chapterId: 'PSA.135',
    count: 21
  },
  {
    chapterId: 'PSA.136',
    count: 26
  },
  {
    chapterId: 'PSA.137',
    count: 9
  },
  {
    chapterId: 'PSA.138',
    count: 8
  },
  {
    chapterId: 'PSA.139',
    count: 24
  },
  {
    chapterId: 'PSA.140',
    count: 13
  },
  {
    chapterId: 'PSA.141',
    count: 10
  },
  {
    chapterId: 'PSA.142',
    count: 7
  },
  {
    chapterId: 'PSA.143',
    count: 12
  },
  {
    chapterId: 'PSA.144',
    count: 15
  },
  {
    chapterId: 'PSA.145',
    count: 21
  },
  {
    chapterId: 'PSA.146',
    count: 10
  },
  {
    chapterId: 'PSA.147',
    count: 20
  },
  {
    chapterId: 'PSA.148',
    count: 14
  },
  {
    chapterId: 'PSA.149',
    count: 9
  },
  {
    chapterId: 'PSA.150',
    count: 6
  },
  {
    chapterId: 'PRO.1',
    count: 33
  },
  {
    chapterId: 'PRO.2',
    count: 22
  },
  {
    chapterId: 'PRO.3',
    count: 35
  },
  {
    chapterId: 'PRO.4',
    count: 27
  },
  {
    chapterId: 'PRO.5',
    count: 23
  },
  {
    chapterId: 'PRO.6',
    count: 35
  },
  {
    chapterId: 'PRO.7',
    count: 27
  },
  {
    chapterId: 'PRO.8',
    count: 36
  },
  {
    chapterId: 'PRO.9',
    count: 18
  },
  {
    chapterId: 'PRO.10',
    count: 32
  },
  {
    chapterId: 'PRO.11',
    count: 31
  },
  {
    chapterId: 'PRO.12',
    count: 28
  },
  {
    chapterId: 'PRO.13',
    count: 25
  },
  {
    chapterId: 'PRO.14',
    count: 35
  },
  {
    chapterId: 'PRO.15',
    count: 33
  },
  {
    chapterId: 'PRO.16',
    count: 33
  },
  {
    chapterId: 'PRO.17',
    count: 28
  },
  {
    chapterId: 'PRO.18',
    count: 24
  },
  {
    chapterId: 'PRO.19',
    count: 29
  },
  {
    chapterId: 'PRO.20',
    count: 30
  },
  {
    chapterId: 'PRO.21',
    count: 31
  },
  {
    chapterId: 'PRO.22',
    count: 29
  },
  {
    chapterId: 'PRO.23',
    count: 35
  },
  {
    chapterId: 'PRO.24',
    count: 34
  },
  {
    chapterId: 'PRO.25',
    count: 28
  },
  {
    chapterId: 'PRO.26',
    count: 28
  },
  {
    chapterId: 'PRO.27',
    count: 27
  },
  {
    chapterId: 'PRO.28',
    count: 28
  },
  {
    chapterId: 'PRO.29',
    count: 27
  },
  {
    chapterId: 'PRO.30',
    count: 33
  },
  {
    chapterId: 'PRO.31',
    count: 31
  },
  {
    chapterId: 'ECC.1',
    count: 18
  },
  {
    chapterId: 'ECC.2',
    count: 26
  },
  {
    chapterId: 'ECC.3',
    count: 22
  },
  {
    chapterId: 'ECC.4',
    count: 16
  },
  {
    chapterId: 'ECC.5',
    count: 20
  },
  {
    chapterId: 'ECC.6',
    count: 12
  },
  {
    chapterId: 'ECC.7',
    count: 29
  },
  {
    chapterId: 'ECC.8',
    count: 17
  },
  {
    chapterId: 'ECC.9',
    count: 18
  },
  {
    chapterId: 'ECC.10',
    count: 20
  },
  {
    chapterId: 'ECC.11',
    count: 10
  },
  {
    chapterId: 'ECC.12',
    count: 14
  },
  {
    chapterId: 'SNG.1',
    count: 17
  },
  {
    chapterId: 'SNG.2',
    count: 17
  },
  {
    chapterId: 'SNG.3',
    count: 11
  },
  {
    chapterId: 'SNG.4',
    count: 16
  },
  {
    chapterId: 'SNG.5',
    count: 16
  },
  {
    chapterId: 'SNG.6',
    count: 13
  },
  {
    chapterId: 'SNG.7',
    count: 13
  },
  {
    chapterId: 'SNG.8',
    count: 14
  },
  {
    chapterId: 'ISA.1',
    count: 31
  },
  {
    chapterId: 'ISA.2',
    count: 22
  },
  {
    chapterId: 'ISA.3',
    count: 26
  },
  {
    chapterId: 'ISA.4',
    count: 6
  },
  {
    chapterId: 'ISA.5',
    count: 30
  },
  {
    chapterId: 'ISA.6',
    count: 13
  },
  {
    chapterId: 'ISA.7',
    count: 25
  },
  {
    chapterId: 'ISA.8',
    count: 22
  },
  {
    chapterId: 'ISA.9',
    count: 21
  },
  {
    chapterId: 'ISA.10',
    count: 34
  },
  {
    chapterId: 'ISA.11',
    count: 16
  },
  {
    chapterId: 'ISA.12',
    count: 6
  },
  {
    chapterId: 'ISA.13',
    count: 22
  },
  {
    chapterId: 'ISA.14',
    count: 32
  },
  {
    chapterId: 'ISA.15',
    count: 9
  },
  {
    chapterId: 'ISA.16',
    count: 14
  },
  {
    chapterId: 'ISA.17',
    count: 14
  },
  {
    chapterId: 'ISA.18',
    count: 7
  },
  {
    chapterId: 'ISA.19',
    count: 25
  },
  {
    chapterId: 'ISA.20',
    count: 6
  },
  {
    chapterId: 'ISA.21',
    count: 17
  },
  {
    chapterId: 'ISA.22',
    count: 25
  },
  {
    chapterId: 'ISA.23',
    count: 18
  },
  {
    chapterId: 'ISA.24',
    count: 23
  },
  {
    chapterId: 'ISA.25',
    count: 12
  },
  {
    chapterId: 'ISA.26',
    count: 21
  },
  {
    chapterId: 'ISA.27',
    count: 13
  },
  {
    chapterId: 'ISA.28',
    count: 29
  },
  {
    chapterId: 'ISA.29',
    count: 24
  },
  {
    chapterId: 'ISA.30',
    count: 33
  },
  {
    chapterId: 'ISA.31',
    count: 9
  },
  {
    chapterId: 'ISA.32',
    count: 20
  },
  {
    chapterId: 'ISA.33',
    count: 24
  },
  {
    chapterId: 'ISA.34',
    count: 17
  },
  {
    chapterId: 'ISA.35',
    count: 10
  },
  {
    chapterId: 'ISA.36',
    count: 22
  },
  {
    chapterId: 'ISA.37',
    count: 38
  },
  {
    chapterId: 'ISA.38',
    count: 22
  },
  {
    chapterId: 'ISA.39',
    count: 8
  },
  {
    chapterId: 'ISA.40',
    count: 31
  },
  {
    chapterId: 'ISA.41',
    count: 29
  },
  {
    chapterId: 'ISA.42',
    count: 25
  },
  {
    chapterId: 'ISA.43',
    count: 28
  },
  {
    chapterId: 'ISA.44',
    count: 28
  },
  {
    chapterId: 'ISA.45',
    count: 25
  },
  {
    chapterId: 'ISA.46',
    count: 13
  },
  {
    chapterId: 'ISA.47',
    count: 15
  },
  {
    chapterId: 'ISA.48',
    count: 22
  },
  {
    chapterId: 'ISA.49',
    count: 26
  },
  {
    chapterId: 'ISA.50',
    count: 11
  },
  {
    chapterId: 'ISA.51',
    count: 23
  },
  {
    chapterId: 'ISA.52',
    count: 15
  },
  {
    chapterId: 'ISA.53',
    count: 12
  },
  {
    chapterId: 'ISA.54',
    count: 17
  },
  {
    chapterId: 'ISA.55',
    count: 13
  },
  {
    chapterId: 'ISA.56',
    count: 12
  },
  {
    chapterId: 'ISA.57',
    count: 21
  },
  {
    chapterId: 'ISA.58',
    count: 14
  },
  {
    chapterId: 'ISA.59',
    count: 21
  },
  {
    chapterId: 'ISA.60',
    count: 22
  },
  {
    chapterId: 'ISA.61',
    count: 11
  },
  {
    chapterId: 'ISA.62',
    count: 12
  },
  {
    chapterId: 'ISA.63',
    count: 19
  },
  {
    chapterId: 'ISA.64',
    count: 12
  },
  {
    chapterId: 'ISA.65',
    count: 25
  },
  {
    chapterId: 'ISA.66',
    count: 24
  },
  {
    chapterId: 'JER.1',
    count: 19
  },
  {
    chapterId: 'JER.2',
    count: 37
  },
  {
    chapterId: 'JER.3',
    count: 25
  },
  {
    chapterId: 'JER.4',
    count: 31
  },
  {
    chapterId: 'JER.5',
    count: 31
  },
  {
    chapterId: 'JER.6',
    count: 30
  },
  {
    chapterId: 'JER.7',
    count: 34
  },
  {
    chapterId: 'JER.8',
    count: 22
  },
  {
    chapterId: 'JER.9',
    count: 26
  },
  {
    chapterId: 'JER.10',
    count: 25
  },
  {
    chapterId: 'JER.11',
    count: 23
  },
  {
    chapterId: 'JER.12',
    count: 17
  },
  {
    chapterId: 'JER.13',
    count: 27
  },
  {
    chapterId: 'JER.14',
    count: 22
  },
  {
    chapterId: 'JER.15',
    count: 21
  },
  {
    chapterId: 'JER.16',
    count: 21
  },
  {
    chapterId: 'JER.17',
    count: 27
  },
  {
    chapterId: 'JER.18',
    count: 23
  },
  {
    chapterId: 'JER.19',
    count: 15
  },
  {
    chapterId: 'JER.20',
    count: 18
  },
  {
    chapterId: 'JER.21',
    count: 14
  },
  {
    chapterId: 'JER.22',
    count: 30
  },
  {
    chapterId: 'JER.23',
    count: 40
  },
  {
    chapterId: 'JER.24',
    count: 10
  },
  {
    chapterId: 'JER.25',
    count: 38
  },
  {
    chapterId: 'JER.26',
    count: 24
  },
  {
    chapterId: 'JER.27',
    count: 22
  },
  {
    chapterId: 'JER.28',
    count: 17
  },
  {
    chapterId: 'JER.29',
    count: 32
  },
  {
    chapterId: 'JER.30',
    count: 24
  },
  {
    chapterId: 'JER.31',
    count: 40
  },
  {
    chapterId: 'JER.32',
    count: 44
  },
  {
    chapterId: 'JER.33',
    count: 26
  },
  {
    chapterId: 'JER.34',
    count: 22
  },
  {
    chapterId: 'JER.35',
    count: 19
  },
  {
    chapterId: 'JER.36',
    count: 32
  },
  {
    chapterId: 'JER.37',
    count: 21
  },
  {
    chapterId: 'JER.38',
    count: 28
  },
  {
    chapterId: 'JER.39',
    count: 18
  },
  {
    chapterId: 'JER.40',
    count: 16
  },
  {
    chapterId: 'JER.41',
    count: 18
  },
  {
    chapterId: 'JER.42',
    count: 22
  },
  {
    chapterId: 'JER.43',
    count: 13
  },
  {
    chapterId: 'JER.44',
    count: 30
  },
  {
    chapterId: 'JER.45',
    count: 5
  },
  {
    chapterId: 'JER.46',
    count: 28
  },
  {
    chapterId: 'JER.47',
    count: 7
  },
  {
    chapterId: 'JER.48',
    count: 47
  },
  {
    chapterId: 'JER.49',
    count: 39
  },
  {
    chapterId: 'JER.50',
    count: 46
  },
  {
    chapterId: 'JER.51',
    count: 64
  },
  {
    chapterId: 'JER.52',
    count: 34
  },
  {
    chapterId: 'LAM.1',
    count: 22
  },
  {
    chapterId: 'LAM.2',
    count: 22
  },
  {
    chapterId: 'LAM.3',
    count: 66
  },
  {
    chapterId: 'LAM.4',
    count: 22
  },
  {
    chapterId: 'LAM.5',
    count: 22
  },
  {
    chapterId: 'EZK.1',
    count: 28
  },
  {
    chapterId: 'EZK.2',
    count: 10
  },
  {
    chapterId: 'EZK.3',
    count: 27
  },
  {
    chapterId: 'EZK.4',
    count: 17
  },
  {
    chapterId: 'EZK.5',
    count: 17
  },
  {
    chapterId: 'EZK.6',
    count: 14
  },
  {
    chapterId: 'EZK.7',
    count: 27
  },
  {
    chapterId: 'EZK.8',
    count: 18
  },
  {
    chapterId: 'EZK.9',
    count: 11
  },
  {
    chapterId: 'EZK.10',
    count: 22
  },
  {
    chapterId: 'EZK.11',
    count: 25
  },
  {
    chapterId: 'EZK.12',
    count: 28
  },
  {
    chapterId: 'EZK.13',
    count: 23
  },
  {
    chapterId: 'EZK.14',
    count: 23
  },
  {
    chapterId: 'EZK.15',
    count: 8
  },
  {
    chapterId: 'EZK.16',
    count: 63
  },
  {
    chapterId: 'EZK.17',
    count: 24
  },
  {
    chapterId: 'EZK.18',
    count: 32
  },
  {
    chapterId: 'EZK.19',
    count: 14
  },
  {
    chapterId: 'EZK.20',
    count: 49
  },
  {
    chapterId: 'EZK.21',
    count: 32
  },
  {
    chapterId: 'EZK.22',
    count: 31
  },
  {
    chapterId: 'EZK.23',
    count: 49
  },
  {
    chapterId: 'EZK.24',
    count: 27
  },
  {
    chapterId: 'EZK.25',
    count: 17
  },
  {
    chapterId: 'EZK.26',
    count: 21
  },
  {
    chapterId: 'EZK.27',
    count: 36
  },
  {
    chapterId: 'EZK.28',
    count: 26
  },
  {
    chapterId: 'EZK.29',
    count: 21
  },
  {
    chapterId: 'EZK.30',
    count: 26
  },
  {
    chapterId: 'EZK.31',
    count: 18
  },
  {
    chapterId: 'EZK.32',
    count: 32
  },
  {
    chapterId: 'EZK.33',
    count: 33
  },
  {
    chapterId: 'EZK.34',
    count: 31
  },
  {
    chapterId: 'EZK.35',
    count: 15
  },
  {
    chapterId: 'EZK.36',
    count: 38
  },
  {
    chapterId: 'EZK.37',
    count: 28
  },
  {
    chapterId: 'EZK.38',
    count: 23
  },
  {
    chapterId: 'EZK.39',
    count: 29
  },
  {
    chapterId: 'EZK.40',
    count: 49
  },
  {
    chapterId: 'EZK.41',
    count: 26
  },
  {
    chapterId: 'EZK.42',
    count: 20
  },
  {
    chapterId: 'EZK.43',
    count: 27
  },
  {
    chapterId: 'EZK.44',
    count: 31
  },
  {
    chapterId: 'EZK.45',
    count: 25
  },
  {
    chapterId: 'EZK.46',
    count: 24
  },
  {
    chapterId: 'EZK.47',
    count: 23
  },
  {
    chapterId: 'EZK.48',
    count: 35
  },
  {
    chapterId: 'DAN.1',
    count: 21
  },
  {
    chapterId: 'DAN.2',
    count: 49
  },
  {
    chapterId: 'DAN.3',
    count: 30
  },
  {
    chapterId: 'DAN.4',
    count: 37
  },
  {
    chapterId: 'DAN.5',
    count: 31
  },
  {
    chapterId: 'DAN.6',
    count: 28
  },
  {
    chapterId: 'DAN.7',
    count: 28
  },
  {
    chapterId: 'DAN.8',
    count: 27
  },
  {
    chapterId: 'DAN.9',
    count: 27
  },
  {
    chapterId: 'DAN.10',
    count: 21
  },
  {
    chapterId: 'DAN.11',
    count: 45
  },
  {
    chapterId: 'DAN.12',
    count: 13
  },
  {
    chapterId: 'HOS.1',
    count: 11
  },
  {
    chapterId: 'HOS.2',
    count: 23
  },
  {
    chapterId: 'HOS.3',
    count: 5
  },
  {
    chapterId: 'HOS.4',
    count: 19
  },
  {
    chapterId: 'HOS.5',
    count: 15
  },
  {
    chapterId: 'HOS.6',
    count: 11
  },
  {
    chapterId: 'HOS.7',
    count: 16
  },
  {
    chapterId: 'HOS.8',
    count: 14
  },
  {
    chapterId: 'HOS.9',
    count: 17
  },
  {
    chapterId: 'HOS.10',
    count: 15
  },
  {
    chapterId: 'HOS.11',
    count: 12
  },
  {
    chapterId: 'HOS.12',
    count: 14
  },
  {
    chapterId: 'HOS.13',
    count: 16
  },
  {
    chapterId: 'HOS.14',
    count: 9
  },
  {
    chapterId: 'JOL.1',
    count: 20
  },
  {
    chapterId: 'JOL.2',
    count: 32
  },
  {
    chapterId: 'JOL.3',
    count: 21
  },
  {
    chapterId: 'AMO.1',
    count: 15
  },
  {
    chapterId: 'AMO.2',
    count: 16
  },
  {
    chapterId: 'AMO.3',
    count: 15
  },
  {
    chapterId: 'AMO.4',
    count: 13
  },
  {
    chapterId: 'AMO.5',
    count: 27
  },
  {
    chapterId: 'AMO.6',
    count: 14
  },
  {
    chapterId: 'AMO.7',
    count: 17
  },
  {
    chapterId: 'AMO.8',
    count: 14
  },
  {
    chapterId: 'AMO.9',
    count: 15
  },
  {
    chapterId: 'OBA.1',
    count: 21
  },
  {
    chapterId: 'JON.1',
    count: 17
  },
  {
    chapterId: 'JON.2',
    count: 10
  },
  {
    chapterId: 'JON.3',
    count: 10
  },
  {
    chapterId: 'JON.4',
    count: 11
  },
  {
    chapterId: 'MIC.1',
    count: 16
  },
  {
    chapterId: 'MIC.2',
    count: 13
  },
  {
    chapterId: 'MIC.3',
    count: 12
  },
  {
    chapterId: 'MIC.4',
    count: 13
  },
  {
    chapterId: 'MIC.5',
    count: 15
  },
  {
    chapterId: 'MIC.6',
    count: 16
  },
  {
    chapterId: 'MIC.7',
    count: 20
  },
  {
    chapterId: 'NAM.1',
    count: 15
  },
  {
    chapterId: 'NAM.2',
    count: 13
  },
  {
    chapterId: 'NAM.3',
    count: 19
  },
  {
    chapterId: 'HAB.1',
    count: 17
  },
  {
    chapterId: 'HAB.2',
    count: 20
  },
  {
    chapterId: 'HAB.3',
    count: 19
  },
  {
    chapterId: 'ZEP.1',
    count: 18
  },
  {
    chapterId: 'ZEP.2',
    count: 15
  },
  {
    chapterId: 'ZEP.3',
    count: 20
  },
  {
    chapterId: 'HAG.1',
    count: 15
  },
  {
    chapterId: 'HAG.2',
    count: 23
  },
  {
    chapterId: 'ZEC.1',
    count: 21
  },
  {
    chapterId: 'ZEC.2',
    count: 13
  },
  {
    chapterId: 'ZEC.3',
    count: 10
  },
  {
    chapterId: 'ZEC.4',
    count: 14
  },
  {
    chapterId: 'ZEC.5',
    count: 11
  },
  {
    chapterId: 'ZEC.6',
    count: 15
  },
  {
    chapterId: 'ZEC.7',
    count: 14
  },
  {
    chapterId: 'ZEC.8',
    count: 23
  },
  {
    chapterId: 'ZEC.9',
    count: 17
  },
  {
    chapterId: 'ZEC.10',
    count: 12
  },
  {
    chapterId: 'ZEC.11',
    count: 17
  },
  {
    chapterId: 'ZEC.12',
    count: 14
  },
  {
    chapterId: 'ZEC.13',
    count: 9
  },
  {
    chapterId: 'ZEC.14',
    count: 21
  },
  {
    chapterId: 'MAL.1',
    count: 14
  },
  {
    chapterId: 'MAL.2',
    count: 17
  },
  {
    chapterId: 'MAL.3',
    count: 18
  },
  {
    chapterId: 'MAL.4',
    count: 6
  },
  {
    chapterId: 'MAT.1',
    count: 25
  },
  {
    chapterId: 'MAT.2',
    count: 23
  },
  {
    chapterId: 'MAT.3',
    count: 17
  },
  {
    chapterId: 'MAT.4',
    count: 25
  },
  {
    chapterId: 'MAT.5',
    count: 48
  },
  {
    chapterId: 'MAT.6',
    count: 34
  },
  {
    chapterId: 'MAT.7',
    count: 29
  },
  {
    chapterId: 'MAT.8',
    count: 34
  },
  {
    chapterId: 'MAT.9',
    count: 38
  },
  {
    chapterId: 'MAT.10',
    count: 42
  },
  {
    chapterId: 'MAT.11',
    count: 30
  },
  {
    chapterId: 'MAT.12',
    count: 50
  },
  {
    chapterId: 'MAT.13',
    count: 58
  },
  {
    chapterId: 'MAT.14',
    count: 36
  },
  {
    chapterId: 'MAT.15',
    count: 39
  },
  {
    chapterId: 'MAT.16',
    count: 28
  },
  {
    chapterId: 'MAT.17',
    count: 26
  },
  {
    chapterId: 'MAT.18',
    count: 34
  },
  {
    chapterId: 'MAT.19',
    count: 30
  },
  {
    chapterId: 'MAT.20',
    count: 34
  },
  {
    chapterId: 'MAT.21',
    count: 46
  },
  {
    chapterId: 'MAT.22',
    count: 46
  },
  {
    chapterId: 'MAT.23',
    count: 38
  },
  {
    chapterId: 'MAT.24',
    count: 51
  },
  {
    chapterId: 'MAT.25',
    count: 46
  },
  {
    chapterId: 'MAT.26',
    count: 75
  },
  {
    chapterId: 'MAT.27',
    count: 66
  },
  {
    chapterId: 'MAT.28',
    count: 20
  },
  {
    chapterId: 'MRK.1',
    count: 45
  },
  {
    chapterId: 'MRK.2',
    count: 28
  },
  {
    chapterId: 'MRK.3',
    count: 35
  },
  {
    chapterId: 'MRK.4',
    count: 41
  },
  {
    chapterId: 'MRK.5',
    count: 43
  },
  {
    chapterId: 'MRK.6',
    count: 56
  },
  {
    chapterId: 'MRK.7',
    count: 36
  },
  {
    chapterId: 'MRK.8',
    count: 38
  },
  {
    chapterId: 'MRK.9',
    count: 48
  },
  {
    chapterId: 'MRK.10',
    count: 52
  },
  {
    chapterId: 'MRK.11',
    count: 32
  },
  {
    chapterId: 'MRK.12',
    count: 44
  },
  {
    chapterId: 'MRK.13',
    count: 37
  },
  {
    chapterId: 'MRK.14',
    count: 72
  },
  {
    chapterId: 'MRK.15',
    count: 46
  },
  {
    chapterId: 'MRK.16',
    count: 20
  },
  {
    chapterId: 'LUK.1',
    count: 80
  },
  {
    chapterId: 'LUK.2',
    count: 52
  },
  {
    chapterId: 'LUK.3',
    count: 38
  },
  {
    chapterId: 'LUK.4',
    count: 44
  },
  {
    chapterId: 'LUK.5',
    count: 39
  },
  {
    chapterId: 'LUK.6',
    count: 49
  },
  {
    chapterId: 'LUK.7',
    count: 50
  },
  {
    chapterId: 'LUK.8',
    count: 56
  },
  {
    chapterId: 'LUK.9',
    count: 62
  },
  {
    chapterId: 'LUK.10',
    count: 42
  },
  {
    chapterId: 'LUK.11',
    count: 54
  },
  {
    chapterId: 'LUK.12',
    count: 59
  },
  {
    chapterId: 'LUK.13',
    count: 35
  },
  {
    chapterId: 'LUK.14',
    count: 35
  },
  {
    chapterId: 'LUK.15',
    count: 32
  },
  {
    chapterId: 'LUK.16',
    count: 31
  },
  {
    chapterId: 'LUK.17',
    count: 36
  },
  {
    chapterId: 'LUK.18',
    count: 43
  },
  {
    chapterId: 'LUK.19',
    count: 48
  },
  {
    chapterId: 'LUK.20',
    count: 47
  },
  {
    chapterId: 'LUK.21',
    count: 38
  },
  {
    chapterId: 'LUK.22',
    count: 71
  },
  {
    chapterId: 'LUK.23',
    count: 55
  },
  {
    chapterId: 'LUK.24',
    count: 53
  },
  {
    chapterId: 'JHN.1',
    count: 51
  },
  {
    chapterId: 'JHN.2',
    count: 25
  },
  {
    chapterId: 'JHN.3',
    count: 36
  },
  {
    chapterId: 'JHN.4',
    count: 54
  },
  {
    chapterId: 'JHN.5',
    count: 46
  },
  {
    chapterId: 'JHN.6',
    count: 71
  },
  {
    chapterId: 'JHN.7',
    count: 53
  },
  {
    chapterId: 'JHN.8',
    count: 59
  },
  {
    chapterId: 'JHN.9',
    count: 41
  },
  {
    chapterId: 'JHN.10',
    count: 42
  },
  {
    chapterId: 'JHN.11',
    count: 57
  },
  {
    chapterId: 'JHN.12',
    count: 50
  },
  {
    chapterId: 'JHN.13',
    count: 38
  },
  {
    chapterId: 'JHN.14',
    count: 31
  },
  {
    chapterId: 'JHN.15',
    count: 27
  },
  {
    chapterId: 'JHN.16',
    count: 33
  },
  {
    chapterId: 'JHN.17',
    count: 26
  },
  {
    chapterId: 'JHN.18',
    count: 40
  },
  {
    chapterId: 'JHN.19',
    count: 42
  },
  {
    chapterId: 'JHN.20',
    count: 31
  },
  {
    chapterId: 'JHN.21',
    count: 25
  },
  {
    chapterId: 'ACT.1',
    count: 26
  },
  {
    chapterId: 'ACT.2',
    count: 47
  },
  {
    chapterId: 'ACT.3',
    count: 26
  },
  {
    chapterId: 'ACT.4',
    count: 37
  },
  {
    chapterId: 'ACT.5',
    count: 42
  },
  {
    chapterId: 'ACT.6',
    count: 15
  },
  {
    chapterId: 'ACT.7',
    count: 60
  },
  {
    chapterId: 'ACT.8',
    count: 39
  },
  {
    chapterId: 'ACT.9',
    count: 43
  },
  {
    chapterId: 'ACT.10',
    count: 48
  },
  {
    chapterId: 'ACT.11',
    count: 30
  },
  {
    chapterId: 'ACT.12',
    count: 25
  },
  {
    chapterId: 'ACT.13',
    count: 52
  },
  {
    chapterId: 'ACT.14',
    count: 28
  },
  {
    chapterId: 'ACT.15',
    count: 40
  },
  {
    chapterId: 'ACT.16',
    count: 40
  },
  {
    chapterId: 'ACT.17',
    count: 34
  },
  {
    chapterId: 'ACT.18',
    count: 28
  },
  {
    chapterId: 'ACT.19',
    count: 41
  },
  {
    chapterId: 'ACT.20',
    count: 38
  },
  {
    chapterId: 'ACT.21',
    count: 40
  },
  {
    chapterId: 'ACT.22',
    count: 30
  },
  {
    chapterId: 'ACT.23',
    count: 35
  },
  {
    chapterId: 'ACT.24',
    count: 25
  },
  {
    chapterId: 'ACT.25',
    count: 27
  },
  {
    chapterId: 'ACT.26',
    count: 32
  },
  {
    chapterId: 'ACT.27',
    count: 44
  },
  {
    chapterId: 'ACT.28',
    count: 30
  },
  {
    chapterId: 'ROM.1',
    count: 32
  },
  {
    chapterId: 'ROM.2',
    count: 29
  },
  {
    chapterId: 'ROM.3',
    count: 31
  },
  {
    chapterId: 'ROM.4',
    count: 25
  },
  {
    chapterId: 'ROM.5',
    count: 21
  },
  {
    chapterId: 'ROM.6',
    count: 23
  },
  {
    chapterId: 'ROM.7',
    count: 25
  },
  {
    chapterId: 'ROM.8',
    count: 39
  },
  {
    chapterId: 'ROM.9',
    count: 33
  },
  {
    chapterId: 'ROM.10',
    count: 21
  },
  {
    chapterId: 'ROM.11',
    count: 36
  },
  {
    chapterId: 'ROM.12',
    count: 21
  },
  {
    chapterId: 'ROM.13',
    count: 14
  },
  {
    chapterId: 'ROM.14',
    count: 23
  },
  {
    chapterId: 'ROM.15',
    count: 33
  },
  {
    chapterId: 'ROM.16',
    count: 26
  },
  {
    chapterId: '1CO.1',
    count: 31
  },
  {
    chapterId: '1CO.2',
    count: 16
  },
  {
    chapterId: '1CO.3',
    count: 23
  },
  {
    chapterId: '1CO.4',
    count: 21
  },
  {
    chapterId: '1CO.5',
    count: 13
  },
  {
    chapterId: '1CO.6',
    count: 20
  },
  {
    chapterId: '1CO.7',
    count: 40
  },
  {
    chapterId: '1CO.8',
    count: 13
  },
  {
    chapterId: '1CO.9',
    count: 27
  },
  {
    chapterId: '1CO.10',
    count: 33
  },
  {
    chapterId: '1CO.11',
    count: 34
  },
  {
    chapterId: '1CO.12',
    count: 31
  },
  {
    chapterId: '1CO.13',
    count: 13
  },
  {
    chapterId: '1CO.14',
    count: 40
  },
  {
    chapterId: '1CO.15',
    count: 58
  },
  {
    chapterId: '1CO.16',
    count: 24
  },
  {
    chapterId: '2CO.1',
    count: 24
  },
  {
    chapterId: '2CO.2',
    count: 17
  },
  {
    chapterId: '2CO.3',
    count: 18
  },
  {
    chapterId: '2CO.4',
    count: 18
  },
  {
    chapterId: '2CO.5',
    count: 21
  },
  {
    chapterId: '2CO.6',
    count: 18
  },
  {
    chapterId: '2CO.7',
    count: 16
  },
  {
    chapterId: '2CO.8',
    count: 24
  },
  {
    chapterId: '2CO.9',
    count: 15
  },
  {
    chapterId: '2CO.10',
    count: 18
  },
  {
    chapterId: '2CO.11',
    count: 33
  },
  {
    chapterId: '2CO.12',
    count: 21
  },
  {
    chapterId: '2CO.13',
    count: 13
  },
  {
    chapterId: 'GAL.1',
    count: 24
  },
  {
    chapterId: 'GAL.2',
    count: 21
  },
  {
    chapterId: 'GAL.3',
    count: 29
  },
  {
    chapterId: 'GAL.4',
    count: 31
  },
  {
    chapterId: 'GAL.5',
    count: 26
  },
  {
    chapterId: 'GAL.6',
    count: 18
  },
  {
    chapterId: 'EPH.1',
    count: 23
  },
  {
    chapterId: 'EPH.2',
    count: 22
  },
  {
    chapterId: 'EPH.3',
    count: 21
  },
  {
    chapterId: 'EPH.4',
    count: 32
  },
  {
    chapterId: 'EPH.5',
    count: 33
  },
  {
    chapterId: 'EPH.6',
    count: 24
  },
  {
    chapterId: 'PHP.1',
    count: 30
  },
  {
    chapterId: 'PHP.2',
    count: 30
  },
  {
    chapterId: 'PHP.3',
    count: 21
  },
  {
    chapterId: 'PHP.4',
    count: 23
  },
  {
    chapterId: 'COL.1',
    count: 29
  },
  {
    chapterId: 'COL.2',
    count: 23
  },
  {
    chapterId: 'COL.3',
    count: 25
  },
  {
    chapterId: 'COL.4',
    count: 18
  },
  {
    chapterId: '1TH.1',
    count: 10
  },
  {
    chapterId: '1TH.2',
    count: 20
  },
  {
    chapterId: '1TH.3',
    count: 13
  },
  {
    chapterId: '1TH.4',
    count: 18
  },
  {
    chapterId: '1TH.5',
    count: 28
  },
  {
    chapterId: '2TH.1',
    count: 12
  },
  {
    chapterId: '2TH.2',
    count: 17
  },
  {
    chapterId: '2TH.3',
    count: 18
  },
  {
    chapterId: '1TI.1',
    count: 20
  },
  {
    chapterId: '1TI.2',
    count: 15
  },
  {
    chapterId: '1TI.3',
    count: 16
  },
  {
    chapterId: '1TI.4',
    count: 16
  },
  {
    chapterId: '1TI.5',
    count: 25
  },
  {
    chapterId: '1TI.6',
    count: 21
  },
  {
    chapterId: '2TI.1',
    count: 18
  },
  {
    chapterId: '2TI.2',
    count: 26
  },
  {
    chapterId: '2TI.3',
    count: 17
  },
  {
    chapterId: '2TI.4',
    count: 22
  },
  {
    chapterId: 'TIT.1',
    count: 16
  },
  {
    chapterId: 'TIT.2',
    count: 15
  },
  {
    chapterId: 'TIT.3',
    count: 15
  },
  {
    chapterId: 'PHM.1',
    count: 25
  },
  {
    chapterId: 'HEB.1',
    count: 14
  },
  {
    chapterId: 'HEB.2',
    count: 18
  },
  {
    chapterId: 'HEB.3',
    count: 19
  },
  {
    chapterId: 'HEB.4',
    count: 16
  },
  {
    chapterId: 'HEB.5',
    count: 14
  },
  {
    chapterId: 'HEB.6',
    count: 20
  },
  {
    chapterId: 'HEB.7',
    count: 28
  },
  {
    chapterId: 'HEB.8',
    count: 13
  },
  {
    chapterId: 'HEB.9',
    count: 28
  },
  {
    chapterId: 'HEB.10',
    count: 39
  },
  {
    chapterId: 'HEB.11',
    count: 40
  },
  {
    chapterId: 'HEB.12',
    count: 29
  },
  {
    chapterId: 'HEB.13',
    count: 25
  },
  {
    chapterId: 'JAS.1',
    count: 27
  },
  {
    chapterId: 'JAS.2',
    count: 26
  },
  {
    chapterId: 'JAS.3',
    count: 18
  },
  {
    chapterId: 'JAS.4',
    count: 17
  },
  {
    chapterId: 'JAS.5',
    count: 20
  },
  {
    chapterId: '1PE.1',
    count: 25
  },
  {
    chapterId: '1PE.2',
    count: 25
  },
  {
    chapterId: '1PE.3',
    count: 22
  },
  {
    chapterId: '1PE.4',
    count: 19
  },
  {
    chapterId: '1PE.5',
    count: 14
  },
  {
    chapterId: '2PE.1',
    count: 21
  },
  {
    chapterId: '2PE.2',
    count: 22
  },
  {
    chapterId: '2PE.3',
    count: 18
  },
  {
    chapterId: '1JN.1',
    count: 10
  },
  {
    chapterId: '1JN.2',
    count: 29
  },
  {
    chapterId: '1JN.3',
    count: 24
  },
  {
    chapterId: '1JN.4',
    count: 21
  },
  {
    chapterId: '1JN.5',
    count: 21
  },
  {
    chapterId: '2JN.1',
    count: 13
  },
  {
    chapterId: '3JN.1',
    count: 15
  },
  {
    chapterId: 'JUD.1',
    count: 25
  },
  {
    chapterId: 'REV.1',
    count: 20
  },
  {
    chapterId: 'REV.2',
    count: 29
  },
  {
    chapterId: 'REV.3',
    count: 22
  },
  {
    chapterId: 'REV.4',
    count: 11
  },
  {
    chapterId: 'REV.5',
    count: 14
  },
  {
    chapterId: 'REV.6',
    count: 17
  },
  {
    chapterId: 'REV.7',
    count: 17
  },
  {
    chapterId: 'REV.8',
    count: 13
  },
  {
    chapterId: 'REV.9',
    count: 21
  },
  {
    chapterId: 'REV.10',
    count: 11
  },
  {
    chapterId: 'REV.11',
    count: 19
  },
  {
    chapterId: 'REV.12',
    count: 18
  },
  {
    chapterId: 'REV.13',
    count: 18
  },
  {
    chapterId: 'REV.14',
    count: 20
  },
  {
    chapterId: 'REV.15',
    count: 8
  },
  {
    chapterId: 'REV.16',
    count: 21
  },
  {
    chapterId: 'REV.17',
    count: 18
  },
  {
    chapterId: 'REV.18',
    count: 24
  },
  {
    chapterId: 'REV.19',
    count: 21
  },
  {
    chapterId: 'REV.20',
    count: 15
  },
  {
    chapterId: 'REV.21',
    count: 27
  },
  {
    chapterId: 'REV.22',
    count: 21
  }
]

const getVerses = async chapterId => {
  try {
    console.log(chapterId)

    const verses = await axios({
      method: 'get',
      url: `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${chapterId}/verses`,
      headers: {
        accept: 'application/json',
        'api-key': apiKey
      }
    }).then(response => response.data.data)

    let number = 1
    return verses.map(verse => {
      verse.number = number++
      delete verse.orgId
      delete verse.bookId
      delete verse.chapterId
      delete verse.bibleId
      return verse
    })
  } catch (err) {
    console.log(err)
  }
}

const getBooks = async () => {
  books = await axios({
    method: 'get',
    url: `https://api.scripture.api.bible/v1/bibles/${bibleId}/books?include-chapters=true`,
    headers: {
      accept: 'application/json',
      'api-key': apiKey
    }
  }).then(response => response.data.data)

  books.map(async book => {
    delete book.bibleId
    delete book.abbreviation
    delete book.nameLong
    book.chapters = book.chapters.map(chapter => {
      const findCount = CSBVerses.find(
        summary => summary.chapterId === chapter.id
      )
      return findCount.count
    })

    return book
  })

  fs.writeFileSync(fileName, JSON.stringify(books))

  // Start the actual processing
  //sequential(getVerses(chapters.shift()))
}

getBooks()
