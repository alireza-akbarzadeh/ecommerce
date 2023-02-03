import type {
  DragEndEvent,
  DragStartEvent,
  MeasuringConfiguration,
  UniqueIdentifier,
} from '@dnd-kit/core'
import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  DropAnimation,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useDndContext,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS, isKeyboardEvent } from '@dnd-kit/utilities'
import { List, SxProps } from '@mui/material'
import { Theme } from '@mui/system'
import cn from 'classnames'
import React, { useEffect, useState } from 'react'
import type { Props as PageProps } from './dragAbleItem'
import { Item, Position } from './dragAbleItem'
import pageStyles from './dragAbleItem.module.scss'
import styles from './dragAbleList.module.scss'
export enum Layout {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
  Grid = 'grid',
}
interface DndWrapperProps<T> {
  layout?: Layout
  items: T[]
  itemSx?: SxProps<Theme>
  wrapperSx?: SxProps<Theme>
  handle?: boolean
  keyExtractor: (item: T) => UniqueIdentifier
  renderItem: (item: T, index: number, options: { ref: any; listeners: any }) => React.ReactNode
  onDragEnd?: (event: DragEndEvent) => void
}

const measuring: MeasuringConfiguration = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}
const dropAnimation: DropAnimation = {
  keyframes({ transform }) {
    return [
      { transform: CSS.Transform.toString(transform.initial) },
      {
        transform: CSS.Transform.toString({
          scaleX: 0.98,
          scaleY: 0.98,
          x: transform.final.x - 10,
          y: transform.final.y - 10,
        }),
      },
    ]
  },
  sideEffects: defaultDropAnimationSideEffects({
    className: {
      active: pageStyles.active,
    },
  }),
}

const DragAbleList = <T extends object>({
  layout = Layout.Horizontal,
  items: data,
  itemSx,
  handle = false,
  wrapperSx,
  renderItem,
  keyExtractor,
  onDragEnd,
}: DndWrapperProps<T>) => {
  const [activeId, setActiveId] = useState<T | null | any>(null)
  const [items, setItems] = useState<T[]>(data)

  useEffect(() => {
    setItems(data)
  }, [data])

  const _items = items.map((item) => keyExtractor(item))
  const activeIndex = activeId ? _items.indexOf(activeId) : -1

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
    >
      <SortableContext items={items.map<UniqueIdentifier>((item) => keyExtractor(item))}>
        <List sx={wrapperSx} className={cn(styles.Pages, styles[layout])}>
          {items.map((item, index) => (
            <SortablePage
              id={keyExtractor(item)}
              index={index + 1}
              key={keyExtractor(item)}
              item={item}
              sx={itemSx}
              handle={handle}
              layout={layout}
              renderItem={renderItem}
              activeIndex={activeIndex}
              onRemove={() =>
                setItems((items) =>
                  items.filter((_item) => keyExtractor(_item) !== keyExtractor(item)),
                )
              }
            />
          ))}
        </List>
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimation}>
        {activeId ? (
          <PageOverlay
            id={activeId}
            layout={layout}
            items={items.map<UniqueIdentifier>((item) => keyExtractor(item))}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id)
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  function handleDragEnd(dragEvent: DragEndEvent) {
    onDragEnd?.(dragEvent)
    const { over } = dragEvent
    if (over) {
      const overIndex = _items.indexOf(over.id as any)

      if (activeIndex !== overIndex) {
        const newIndex = overIndex

        setItems((items) => arrayMove(items, activeIndex, newIndex))
      }
    }

    setActiveId(null)
  }
}
const defaultInitializer = (index: number) => index

export function createRange<T = number>(
  length: number,
  initializer: (index: number) => any = defaultInitializer,
): T[] {
  return [...new Array(length)].map((_, index) => initializer(index))
}
function PageOverlay({
  id,
  items,
  ...props
}: Omit<PageProps, 'index'> & { items: UniqueIdentifier[] }) {
  const { activatorEvent, over } = useDndContext()
  const isKeyboardSorting = isKeyboardEvent(activatorEvent)
  const activeIndex = items.indexOf(id)
  const overIndex = over?.id ? items.indexOf(over?.id) : -1

  return (
    <Item
      id={id}
      {...props}
      clone
      insertPosition={
        isKeyboardSorting && overIndex !== activeIndex
          ? overIndex > activeIndex
            ? Position.After
            : Position.Before
          : undefined
      }
    >
      {props.children}
    </Item>
  )
}

function SortablePage<T>({
  id,
  activeIndex,
  item,
  handle,
  sx,
  renderItem,
  ...props
}: PageProps & {
  activeIndex: number
  handle: boolean
  itemStyle?: React.CSSProperties
  renderItem: (item: T, index: number, ref: any) => React.ReactNode
  item: T
}) {
  const {
    attributes,
    listeners,
    index,
    isDragging,
    isSorting,
    setActivatorNodeRef,
    over,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges: always,
  })

  return (
    <Item
      ref={setNodeRef}
      id={id}
      sx={sx}
      active={isDragging}
      style={{
        transition,
        transform: isSorting ? undefined : CSS.Translate.toString(transform),
        ...props.itemStyle,
      }}
      insertPosition={
        over?.id === id ? (index > activeIndex ? Position.After : Position.Before) : undefined
      }
      {...props}
      {...attributes}
      {...(handle ? {} : listeners)}
    >
      {renderItem(item, index, { ref: setActivatorNodeRef, listeners })}
    </Item>
  )
}

function always() {
  return true
}
export default DragAbleList
